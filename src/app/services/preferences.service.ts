import { Injectable, signal, effect } from '@angular/core';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type ViewMode = 'landing' | 'reader';
export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  theme = signal<ThemeMode>(this.getStoredTheme());
  fontSize = signal<FontSize>(this.getStoredFontSize());
  soundEnabled = signal<boolean>(this.getStoredSound());
  viewMode = signal<ViewMode>(this.getStoredViewMode());
  
  bookmarks = signal<Set<string>>(this.getStoredBookmarks());
  completedPages = signal<Set<string>>(this.getStoredCompletedPages());
  lastReadPageId = signal<string>(this.getStoredLastReadPageId());

  constructor() {
    effect(() => {
      const themeVal = this.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', themeVal);
        localStorage.setItem('mm_theme', themeVal);
      }
    });

    effect(() => {
      const fsVal = this.fontSize();
      if (typeof document !== 'undefined') {
        const sizes: Record<FontSize, { size: string; line: string }> = {
          sm: { size: '0.88rem', line: '1.6' },
          md: { size: '0.95rem', line: '1.7' },
          lg: { size: '1.05rem', line: '1.75' },
          xl: { size: '1.18rem', line: '1.85' }
        };
        document.documentElement.style.setProperty('--prose-size', sizes[fsVal].size);
        document.documentElement.style.setProperty('--prose-line-height', sizes[fsVal].line);
        localStorage.setItem('mm_font_size', fsVal);
      }
    });

    effect(() => {
      localStorage.setItem('mm_sound_enabled', String(this.soundEnabled()));
    });

    effect(() => {
      localStorage.setItem('mm_view_mode', this.viewMode());
    });

    effect(() => {
      const bSet = Array.from(this.bookmarks());
      localStorage.setItem('mm_bookmarks', JSON.stringify(bSet));
    });

    effect(() => {
      const cSet = Array.from(this.completedPages());
      localStorage.setItem('mm_completed', JSON.stringify(cSet));
    });

    effect(() => {
      localStorage.setItem('mm_last_read', this.lastReadPageId());
    });
  }

  toggleTheme() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  setFontSize(size: FontSize) {
    this.fontSize.set(size);
  }

  toggleSound() {
    this.soundEnabled.update(s => !s);
  }

  setViewMode(mode: ViewMode) {
    this.viewMode.set(mode);
  }

  toggleBookmark(pageId: string) {
    this.bookmarks.update(prev => {
      const next = new Set(prev);
      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }
      return next;
    });
  }

  isBookmarked(pageId: string): boolean {
    return this.bookmarks().has(pageId);
  }

  toggleCompleted(pageId: string) {
    this.completedPages.update(prev => {
      const next = new Set(prev);
      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }
      return next;
    });
  }

  isCompleted(pageId: string): boolean {
    return this.completedPages().has(pageId);
  }

  setLastRead(pageId: string) {
    this.lastReadPageId.set(pageId);
  }

  // Storage getters
  private getStoredTheme(): ThemeMode {
    if (typeof localStorage === 'undefined') return 'light';
    return (localStorage.getItem('mm_theme') as ThemeMode) || 'light';
  }

  private getStoredFontSize(): FontSize {
    if (typeof localStorage === 'undefined') return 'md';
    return (localStorage.getItem('mm_font_size') as FontSize) || 'md';
  }

  private getStoredSound(): boolean {
    if (typeof localStorage === 'undefined') return true;
    const val = localStorage.getItem('mm_sound_enabled');
    return val === null ? true : val === 'true';
  }

  private getStoredViewMode(): ViewMode {
    if (typeof localStorage === 'undefined') return 'landing';
    return (localStorage.getItem('mm_view_mode') as ViewMode) || 'landing';
  }

  private getStoredBookmarks(): Set<string> {
    if (typeof localStorage === 'undefined') return new Set();
    try {
      const val = localStorage.getItem('mm_bookmarks');
      return val ? new Set(JSON.parse(val)) : new Set();
    } catch {
      return new Set();
    }
  }

  private getStoredCompletedPages(): Set<string> {
    if (typeof localStorage === 'undefined') return new Set();
    try {
      const val = localStorage.getItem('mm_completed');
      return val ? new Set(JSON.parse(val)) : new Set();
    } catch {
      return new Set();
    }
  }

  private getStoredLastReadPageId(): string {
    if (typeof localStorage === 'undefined') return 'page-5';
    return localStorage.getItem('mm_last_read') || 'page-5';
  }
}
