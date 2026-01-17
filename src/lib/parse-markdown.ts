export interface Item {
  name: string
  url: string
  description?: string
}

export interface SubSection {
  name: string
  items: Item[]
}

export interface Section {
  name: string
  items: Item[]
  subSections: SubSection[]
}

export interface Category {
  name: string
  items: Item[]
  sections: Section[]
}

function parseItems(items?: string[]) {
  if (items == null || items.length === 0) {
    return []
  }

  return items
    .join('\n')
    .split('- ')
    .filter(Boolean)
    .map((item) => {
      const [link, description] = item.split(/\n/).filter(Boolean)
      const match = link.match(/\[(?<name>[^\]]+)\]\((?<url>[^)]+)\)/)
      const name = match?.groups?.name ?? ''
      const url = match?.groups?.url ?? ''

      return {
        name,
        url,
        description,
      }
    })
}

export function parseMarkdown(content: string): Category[] {
  const categories = content
    .split(/\n## /)
    .filter(category => category.trim() !== '')
    .map((rawCategory) => {
      const [category, ...sections] = rawCategory.split(/\n### /).filter(Boolean)
      const [categoryName, ...items] = category.split(/\n/).filter(Boolean)
      const categoryItems = parseItems(items)

      if (sections.length === 0) {
        return {
          name: categoryName.trim(),
          items: categoryItems,
          sections: [],
        }
      } else {
        return {
          name: categoryName.trim(),
          items: categoryItems,
          sections: sections.map((rawSection) => {
            const [section, ...subSections] = rawSection.split(/\n#### /).filter(Boolean)
            const [sectionName, ...subItems] = section.split(/\n/).filter(Boolean)
            const sectionItems = parseItems(subItems)

            if (subSections.length === 0) {
              return {
                name: sectionName.trim(),
                items: sectionItems,
                subSections: [],
              }
            } else {
              return {
                name: sectionName.trim(),
                items: sectionItems,
                subSections: subSections.map((rawSubSection) => {
                  const [subSectionName, ...subSubItems] = rawSubSection.split(/\n/).filter(Boolean)
                  return {
                    name: subSectionName.trim(),
                    items: parseItems(subSubItems),
                  }
                }),
              }
            }
          }),
        }
      }
    })

  return categories
}
