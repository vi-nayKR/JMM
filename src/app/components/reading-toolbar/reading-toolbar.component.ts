import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesService, FontSize } from '../../services/preferences.service';
import { BookDataService } from '../../services/book-data.service';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-reading-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sticky top-16 z-10 my-4 py-2 px-4 rounded-lg glassmorphism flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <!-- Left: Navigation Jumps & Bookmark -->
      <div class="flex items-center gap-2">
        <button
          (click)="prevPage()"
          [disabled]="!prevNext().prev"
          class="icon-btn px-2.5 py-1 rounded border border-ink-border text-xs text-ink-muted hover:text-ink-text disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="hidden sm:inline">Prev</span>
        </button>

        <button
          (click)="nextPage()"
          [disabled]="!prevNext().next"
          class="icon-btn px-2.5 py-1 rounded border border-ink-border text-xs text-ink-muted hover:text-ink-text disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
        >
          <span class="hidden sm:inline">Next</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div class="w-[1px] h-4 bg-ink-border mx-1"></div>

        <!-- Bookmark Toggle Button -->
        <button
          (click)="toggleBookmark()"
          class="icon-btn flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition-colors"
          [ngClass]="isBookmarked() ? 'text-amber-500 border-amber-500/40 bg-amber-500/10' : 'border-ink-border text-ink-muted'"
        >
          <svg class="w-3.5 h-3.5" [attr.fill]="isBookmarked() ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>{{ isBookmarked() ? 'Bookmarked' : 'Bookmark' }}</span>
        </button>

        <!-- Mark Complete Button -->
        <button
          (click)="toggleCompleted()"
          class="icon-btn flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition-colors"
          [ngClass]="isCompleted() ? 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10' : 'border-ink-border text-ink-muted'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ isCompleted() ? 'Completed' : 'Mark Complete' }}</span>
        </button>
      </div>

      <!-- Right: Font Size Selector -->
      <div class="flex items-center gap-1 bg-ink-surface border border-ink-border p-0.5 rounded">
        <span class="mono-label text-[10px] text-ink-faint px-1.5">SIZE:</span>
        @for (size of fontSizes; track size) {
          <button
            (click)="setFontSize(size)"
            class="px-2 py-0.5 rounded text-xs font-mono uppercase transition-colors"
            [ngClass]="prefs.fontSize() === size ? 'bg-ink-accent text-white' : 'text-ink-muted hover:text-ink-text'"
          >
            {{ size }}
          </button>
        }
      </div>
    </div>
  `
})
export class ReadingToolbarComponent {
  fontSizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];

  constructor(
    public prefs: PreferencesService,
    public bookService: BookDataService,
    private sound: SoundService
  ) {}

  prevNext() {
    return this.bookService.getPrevNext(this.bookService.activePageId());
  }

  prevPage() {
    const { prev } = this.prevNext();
    if (prev) {
      this.sound.playPageFlipSound(this.prefs.soundEnabled());
      this.bookService.setActivePage(prev.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage() {
    const { next } = this.prevNext();
    if (next) {
      this.sound.playPageFlipSound(this.prefs.soundEnabled());
      this.bookService.setActivePage(next.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  isBookmarked(): boolean {
    return this.prefs.isBookmarked(this.bookService.activePageId());
  }

  toggleBookmark() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.prefs.toggleBookmark(this.bookService.activePageId());
  }

  isCompleted(): boolean {
    return this.prefs.isCompleted(this.bookService.activePageId());
  }

  toggleCompleted() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.prefs.toggleCompleted(this.bookService.activePageId());
  }

  setFontSize(size: FontSize) {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.prefs.setFontSize(size);
  }
}
