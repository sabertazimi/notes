import type { Item, Section, SubSection, SubSubSection } from '@site/src/lib/parse-markdown'
import { parseMarkdown } from '@site/src/lib/parse-markdown'
import React, { useEffect, useRef, useState } from 'react'
import styles from './library-gallery.module.css'

interface Props {
  content: string
}

export default function LibraryGallery({ content }: Props): React.JSX.Element {
  const sections = parseMarkdown(content)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedSection = sections?.[selectedSectionIndex] ?? null

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDropdownOpen) {
        return
      }

      switch (event.key) {
        case 'Escape':
          setIsDropdownOpen(false)
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedSectionIndex(prev => (prev > 0 ? prev - 1 : sections.length - 1))
          break
        case 'ArrowDown':
          event.preventDefault()
          setSelectedSectionIndex(prev => (prev < sections.length - 1 ? prev + 1 : 0))
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          setIsDropdownOpen(false)
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDropdownOpen, sections.length])

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleSectionSelect = (index: number) => {
    setSelectedSectionIndex(index)
    setIsDropdownOpen(false)
  }

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <h3>暂无内容</h3>
      <p>该分类下暂时没有可显示的内容。</p>
    </div>
  )

  const parseInlineCode = (text: string) => {
    const parts = text.split(/(`[^`]+`)/)

    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const codeContent = part.slice(1, -1)
        const keyId = `${text.length}-${codeContent}-${index}`
        return <code key={keyId}>{codeContent}</code>
      }

      return part
    })
  }

  const renderItemCard = (item: Item) => (
    <a
      key={item.name}
      className={styles.itemCard}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      title={item.name}
    >
      <span className={styles.itemTitle}>{item.name}</span>
      {item.description != null && <div className={styles.itemDescription}>{parseInlineCode(item.description)}</div>}
    </a>
  )

  const renderItemsGrid = (items: Item[]) => {
    if (items.length === 0) {
      return null
    }

    return <div className={styles.itemsGrid}>{items.map(item => renderItemCard(item))}</div>
  }

  const renderSection = (section: Section | null) => {
    if (!section) {
      return renderEmptyState()
    }

    const hasItems = section.items.length > 0
    const hasSubSections = section.subSections.length > 0

    return (
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>{section.name}</h2>

        {/* 渲染 section 级别的 items */}
        {hasItems && renderItemsGrid(section.items)}

        {/* 渲染 subSections */}
        {hasSubSections && (
          <>
            {section.subSections.map((subSection: SubSection) => (
              <div key={subSection.name} className={styles.subSection}>
                <h3 className={styles.subSectionTitle}>{subSection.name}</h3>
                {renderItemsGrid(subSection.items)}

                {/* 渲染 subSubSections */}
                {subSection.subSubSections.length > 0 && (
                  <>
                    {subSection.subSubSections.map((subSubSection: SubSubSection) => (
                      <div key={subSubSection.name} className={styles.subSubSection}>
                        <h4 className={styles.subSubSectionTitle}>{subSubSection.name}</h4>
                        {renderItemsGrid(subSubSection.items)}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </>
        )}

        {/* 如果既没有 items 也没有 subSections，显示空状态 */}
        {!hasItems && !hasSubSections && renderEmptyState()}
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h3>暂无数据</h3>
          <p>没有找到可显示的分类数据。</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Section 选择下拉菜单 */}
      <div className={styles.sectionSelector}>
        <label htmlFor="section-dropdown">选择分类：</label>
        <div ref={dropdownRef} className={`${styles.dropdown} ${isDropdownOpen ? styles.dropdownOpen : ''}`}>
          <div
            className={styles.dropdownButton}
            onClick={handleDropdownToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleDropdownToggle()
              }
            }}
            tabIndex={0}
            role="button"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            id="section-dropdown"
          >
            <span>{selectedSection?.name ?? '请选择分类'}</span>
            <div className={styles.dropdownArrow} />
          </div>

          <ul className={styles.dropdownMenu} role="listbox" aria-labelledby="section-dropdown">
            {sections.map((section: Section, index: number) => (
              <li
                key={section.name}
                className={`${styles.dropdownItem} ${index === selectedSectionIndex ? styles.active : ''}`}
                onClick={() => handleSectionSelect(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSectionSelect(index)
                  }
                }}
                tabIndex={0}
                role="option"
                aria-selected={index === selectedSectionIndex}
              >
                {section.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 渲染选中的 section */}
      {renderSection(selectedSection)}
    </div>
  )
}
