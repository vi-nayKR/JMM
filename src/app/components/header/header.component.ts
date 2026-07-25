import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesService, FontSize } from '../../services/preferences.service';
import { BookDataService } from '../../services/book-data.service';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="fixed top-0 left-0 right-0 h-14 z-30 glassmorphism flex items-center justify-between px-3 sm:px-5">
      <!-- Progress Bar along top border -->
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-ink-border overflow-hidden">
        <div 
          class="h-full bg-ink-accent transition-all duration-300 ease-out"
          [style.width.%]="bookService.progressPercentage()"
        ></div>
      </div>

      <!-- Left: Sidebar Hamburger & Logo -->
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <button 
          (click)="onToggleSidebar()" 
          class="icon-btn p-2 rounded-lg text-ink-muted hover:text-ink-text hover:bg-ink-surface-raised active:scale-95"
          title="Toggle Navigation"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button 
          (click)="switchView('landing')"
          class="flex items-center gap-2 group text-left min-w-0"
        >
          <div class="w-7 h-7 rounded-lg bg-ink-accent/10 text-ink-accent flex items-center justify-center font-bold text-xs shrink-0 border border-ink-accent/20">
            MM
          </div>
          <div class="min-w-0">
            <div class="mono-label text-xs font-bold text-ink-text group-hover:text-ink-accent transition-colors truncate">
              Money Masterclass
            </div>
            <div class="text-[10px] text-ink-faint hidden md:block">
              100-Page Operating Manual
            </div>
          </div>
        </button>
      </div>

      <!-- Center: Current Module Indicator (Desktop) -->
      <div class="hidden lg:flex items-center gap-2 max-w-xs truncate text-xs text-ink-muted">
        @if (bookService.activeModule(); as mod) {
          <span class="mono-label text-[10px] text-ink-faint font-bold">MOD {{ mod.roman }}</span>
          <span class="text-ink-border">•</span>
          <span class="truncate">{{ mod.title }}</span>
        } @else {
          <span class="mono-label text-[10px] text-ink-faint">GUIDE OVERVIEW</span>
        }
      </div>

      <!-- Right: Search, Theme, Sound, View Mode Controls -->
      <div class="flex items-center gap-1 sm:gap-2 shrink-0">
        <!-- Search Trigger Button -->
        <button
          (click)="onOpenSearch()"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-ink-border bg-ink-surface text-ink-muted hover:text-ink-text hover:border-ink-text/30 text-xs transition-all active:scale-95"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="hidden sm:inline">Search</span>
          <kbd class="hidden sm:inline-block text-[9px] px-1 py-0.5 rounded bg-ink-surface-raised border border-ink-border font-mono">⌘K</kbd>
        </button>

        <!-- View Mode Switcher -->
        <button
          (click)="toggleViewMode()"
          class="icon-btn p-2 rounded-lg text-ink-muted hover:text-ink-text hover:bg-ink-surface-raised active:scale-95"
          [title]="prefs.viewMode() === 'landing' ? 'Switch to Reader' : 'Switch to Dashboard'"
        >
          @if (prefs.viewMode() === 'landing') {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          } @else {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
        </button>

        <!-- Sound Toggle -->
        <button
          (click)="toggleSound()"
          class="icon-btn p-2 rounded-lg text-ink-muted hover:text-ink-text hover:bg-ink-surface-raised active:scale-95"
          [title]="prefs.soundEnabled() ? 'Mute Sounds' : 'Enable Sounds'"
        >
          @if (prefs.soundEnabled()) {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          } @else {
            <svg class="w-4 h-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          }
        </button>

        <!-- Theme Toggle -->
        <button
          (click)="toggleTheme()"
          class="icon-btn p-2 rounded-lg text-ink-muted hover:text-ink-text hover:bg-ink-surface-raised active:scale-95"
          [title]="prefs.theme() === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
        >
          @if (prefs.theme() === 'light') {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          } @else {
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openSearch = new EventEmitter<void>();

  constructor(
    public prefs: PreferencesService,
    public bookService: BookDataService,
    private sound: SoundService
  ) {}

  onToggleSidebar() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.toggleSidebar.emit();
  }

  onOpenSearch() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.openSearch.emit();
  }

  toggleTheme() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.prefs.toggleTheme();
  }

  toggleSound() {
    this.prefs.toggleSound();
    this.sound.playClickSound(this.prefs.soundEnabled());
  }

  toggleViewMode() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.prefs.setViewMode(this.prefs.viewMode() === 'landing' ? 'reader' : 'landing');
  }

  switchView(mode: 'landing' | 'reader') {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.prefs.setViewMode(mode);
  }
}
