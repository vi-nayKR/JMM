import { Injectable, signal, computed } from '@angular/core';
import { BOOK_DATA, BookData, PageItem, ModuleItem } from '../data/book-data';
import { PreferencesService } from './preferences.service';

export interface SearchResult {
  page: PageItem;
  snippet: string;
  matchScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookDataService {
  readonly data: BookData = BOOK_DATA;

  activePageId = signal<string>('page-5');
  expandedModules = signal<{ [key: number]: boolean }>({ 1: true });

  activePage = computed(() => {
    const id = this.activePageId();
    return this.data.allPages.find(p => p.id === id) || this.data.allPages[0];
  });

  activeModule = computed(() => {
    const page = this.activePage();
    if (!page || !page.moduleNumber) return null;
    return this.data.modules.find(m => m.id === page.moduleNumber) || null;
  });

  progressPercentage = computed(() => {
    const total = this.data.allPages.length;
    if (total === 0) return 0;
    const completed = this.prefs.completedPages().size;
    return Math.round((completed / total) * 100);
  });

  constructor(private prefs: PreferencesService) {
    // Sync last read on startup
    const lastRead = this.prefs.lastReadPageId();
    if (lastRead && this.data.allPages.some(p => p.id === lastRead)) {
      this.activePageId.set(lastRead);
    }
  }

  setActivePage(pageId: string) {
    if (this.data.allPages.some(p => p.id === pageId)) {
      this.activePageId.set(pageId);
      this.prefs.setLastRead(pageId);

      // Expand parent module if any
      const target = this.data.allPages.find(p => p.id === pageId);
      if (target && target.moduleNumber) {
        this.toggleModule(target.moduleNumber, true);
      }
    }
  }

  toggleModule(moduleId: number, forceOpen?: boolean) {
    this.expandedModules.update(prev => ({
      ...prev,
      [moduleId]: forceOpen !== undefined ? forceOpen : !prev[moduleId]
    }));
  }

  getPrevNext(currentPageId: string): { prev: PageItem | null; next: PageItem | null } {
    const idx = this.data.allPages.findIndex(p => p.id === currentPageId);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? this.data.allPages[idx - 1] : null,
      next: idx < this.data.allPages.length - 1 ? this.data.allPages[idx + 1] : null
    };
  }

  search(query: string): SearchResult[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResult[] = [];

    for (const page of this.data.allPages) {
      const titleIndex = page.title.toLowerCase().indexOf(q);
      const contentIndex = page.content.toLowerCase().indexOf(q);

      if (titleIndex !== -1 || contentIndex !== -1) {
        let score = 0;
        let snippet = '';

        if (titleIndex !== -1) score += 50;

        if (contentIndex !== -1) {
          score += 20;
          const start = Math.max(0, contentIndex - 40);
          const end = Math.min(page.content.length, contentIndex + 120);
          snippet = (start > 0 ? '...' : '') + page.content.substring(start, end) + (end < page.content.length ? '...' : '');
        } else {
          snippet = page.content.substring(0, 140) + '...';
        }

        results.push({
          page,
          snippet,
          matchScore: score
        });
      }
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }
}
