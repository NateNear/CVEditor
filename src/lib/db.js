import { supabase } from '@/lib/supabase'

export async function loadResumeComposite(resumeId) {
	const { data: resume, error: resumeError } = await supabase
		.from('resumes')
		.select('*')
		.eq('id', resumeId)
		.single()
	if (resumeError) throw resumeError

	const [{ data: personalInfo, error: piError }, { data: sections, error: sectionsError }] = await Promise.all([
		supabase
			.from('resume_personal_info')
			.select('*')
			.eq('resume_id', resumeId)
			.single(),
		supabase
			.from('resume_sections')
			.select('*')
			.eq('resume_id', resumeId)
			.order('position', { ascending: true }),
	])
	if (piError) throw piError
	if (sectionsError) throw sectionsError

	let sectionIds = (sections || []).map(s => s.id)
	let itemsBySectionId = {}
	if (sectionIds.length > 0) {
		const { data: items, error: itemsError } = await supabase
			.from('resume_section_items')
			.select('*')
			.in('section_id', sectionIds)
			.order('position', { ascending: true })
		if (itemsError) throw itemsError
		for (const item of items) {
			if (!itemsBySectionId[item.section_id]) itemsBySectionId[item.section_id] = []
			itemsBySectionId[item.section_id].push({
				id: String(item.id),
				title: item.title || '',
				subtitle: item.subtitle || '',
				description: item.description || '',
				startDate: item.start_date || '',
				endDate: item.end_date || '',
				current: !!item.current,
			})
		}
	}

	const normalizedPersonalInfo = {
		name: personalInfo?.name || '',
		email: personalInfo?.email || '',
		phone: personalInfo?.phone || '',
		location: personalInfo?.location || '',
		summary: personalInfo?.summary || '',
	}

	const normalizedSections = (sections || []).map(s => ({
		id: s.section_key, // stable semantic id like 'experience'
		title: s.title,
		type: s.type,
		items: itemsBySectionId[s.id] || [],
	}))

	return { resume, personalInfo: normalizedPersonalInfo, sections: normalizedSections }
}

export async function saveResumeComposite(resumeId, personalInfo, sections) {
	{
		const { error } = await supabase
			.from('resume_personal_info')
			.upsert({
				resume_id: resumeId,
				name: personalInfo.name || '',
				email: personalInfo.email || '',
				phone: personalInfo.phone || '',
				location: personalInfo.location || '',
				summary: personalInfo.summary || '',
			}, { onConflict: 'resume_id' })
		if (error) throw error
	}

	const { data: existingSections, error: existingSectionsError } = await supabase
		.from('resume_sections')
		.select('*')
		.eq('resume_id', resumeId)
	if (existingSectionsError) throw existingSectionsError
	const byKey = new Map(existingSections.map(s => [s.section_key, s]))

	const upsertedSections = []
	for (let idx = 0; idx < sections.length; idx++) {
		const s = sections[idx]
		const existing = byKey.get(s.id)
		if (existing) {
			const { data, error } = await supabase
				.from('resume_sections')
				.update({ title: s.title, type: s.type, position: idx })
				.eq('id', existing.id)
				.select()
				.single()
			if (error) throw error
			upsertedSections.push(data)
		} else {
			const { data, error } = await supabase
				.from('resume_sections')
				.insert({ resume_id: resumeId, section_key: s.id, title: s.title, type: s.type, position: idx })
				.select()
				.single()
			if (error) throw error
			upsertedSections.push(data)
		}
	}

	const currentKeys = new Set(sections.map(s => s.id))
	const removed = existingSections.filter(s => !currentKeys.has(s.section_key))
	if (removed.length > 0) {
		const removedIds = removed.map(r => r.id)
		await supabase.from('resume_section_items').delete().in('section_id', removedIds)
		await supabase.from('resume_sections').delete().in('id', removedIds)
	}

	for (const s of sections) {
		const stored = upsertedSections.find(us => us.section_key === s.id)
		if (!stored) continue

		const { data: existingItems, error: existingItemsError } = await supabase
			.from('resume_section_items')
			.select('*')
			.eq('section_id', stored.id)
		if (existingItemsError) throw existingItemsError
		const byItemId = new Map(existingItems.map(i => [String(i.id), i]))

		for (let idx = 0; idx < (s.items || []).length; idx++) {
			const it = s.items[idx]
			const existing = byItemId.get(String(it.id))
			if (existing) {
				const { error } = await supabase
					.from('resume_section_items')
					.update({
						title: it.title || '',
						subtitle: it.subtitle || '',
						description: it.description || '',
						start_date: it.startDate || '',
						end_date: it.endDate || '',
						current: !!it.current,
						position: idx,
					})
					.eq('id', existing.id)
				if (error) throw error
				byItemId.delete(String(it.id))
			} else {
				const { error } = await supabase
					.from('resume_section_items')
					.insert({
						section_id: stored.id,
						title: it.title || '',
						subtitle: it.subtitle || '',
						description: it.description || '',
						start_date: it.startDate || '',
						end_date: it.endDate || '',
						current: !!it.current,
						position: idx,
					})
				if (error) throw error
			}
		}

		const leftoverIds = Array.from(byItemId.values()).map(v => v.id)
		if (leftoverIds.length > 0) {
			await supabase.from('resume_section_items').delete().in('id', leftoverIds)
		}
	}
}

export async function createResumeWithDefaults(userId) {
	const { data: resume, error: resumeError } = await supabase
		.from('resumes')
		.insert({ user_id: userId, title: 'Untitled Resume' })
		.select()
		.single()
	if (resumeError) throw resumeError

	const { error: piError } = await supabase
		.from('resume_personal_info')
		.insert({
			resume_id: resume.id,
			name: '',
			email: '',
			phone: '',
			location: '',
			summary: '',
		})
	if (piError) throw piError

	const defaultSections = [
		{ section_key: 'experience', title: 'Experience', type: 'experience', position: 0 },
		{ section_key: 'education', title: 'Education', type: 'education', position: 1 },
		{ section_key: 'skills', title: 'Skills', type: 'skills', position: 2 },
	]
	const { error: sectionsError } = await supabase
		.from('resume_sections')
		.insert(defaultSections.map(s => ({ ...s, resume_id: resume.id })))
	if (sectionsError) throw sectionsError

	return resume
} 