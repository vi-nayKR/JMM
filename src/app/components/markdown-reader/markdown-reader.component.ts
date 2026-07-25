import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import { BookDataService } from '../../services/book-data.service';
import { PreferencesService } from '../../services/preferences.service';
import { SoundService } from '../../services/sound.service';
import { ReadingToolbarComponent } from '../reading-toolbar/reading-toolbar.component';
import { InteractiveWidgetsComponent } from '../interactive-widgets/interactive-widgets.component';

@Component({
  selector: 'app-markdown-reader',
  standalone: true,
  imports: [CommonModule, ReadingToolbarComponent, InteractiveWidgetsComponent],
  template: `
    @if (bookService.activePage(); as page) {
      <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <!-- Breadcrumb & Header -->
        <div class="mb-8 pb-6 border-b border-ink-border space-y-3">
          <div class="flex items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2">
              @if (page.moduleNumber) {
                <span class="mono-label px-2.5 py-1 rounded-md bg-ink-accent/10 text-ink-accent font-bold text-[10px] border border-ink-accent/20">
                  MODULE {{ page.moduleNumber }}
                </span>
                <span class="text-ink-border">•</span>
              }
              <span class="mono-label text-ink-faint text-[11px] font-mono">
                PAGE {{ page.pageNumber }} OF 100
              </span>
            </div>

            @if (prefs.isCompleted(page.id)) {
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-xs">
                ✓ Completed
              </span>
            }
          </div>

          <h1 class="text-3xl sm:text-4xl font-bold text-ink-text font-sans tracking-tight leading-tight">
            {{ page.title }}
          </h1>

          @if (page.moduleTitle) {
            <p class="text-xs text-ink-muted mono-label tracking-wide">
              {{ page.moduleTitle }}
            </p>
          }
        </div>

        <!-- Sticky Reading Toolbar -->
        <app-reading-toolbar></app-reading-toolbar>

        <!-- Markdown Article Body -->
        <article 
          class="prose-custom my-8 space-y-6"
          [innerHTML]="formattedContent()"
        ></article>

        <!-- Contextual Interactive Financial Widgets -->
        @if (page.pageNumber === 5 || page.pageNumber === 65) {
          <app-interactive-widgets widgetType="compounding-simulator"></app-interactive-widgets>
        } @else if (page.pageNumber === 35 || page.pageNumber === 38) {
          <app-interactive-widgets widgetType="cashflow-calculator"></app-interactive-widgets>
        } @else if (page.pageNumber === 55 || page.pageNumber === 64 || page.pageNumber === 85) {
          <app-interactive-widgets widgetType="freedom-ladder"></app-interactive-widgets>
        }

        <!-- Bottom Page Navigation Footer -->
        <div class="mt-14 pt-8 border-t border-ink-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            (click)="prevPage()"
            [disabled]="!prevNext().prev"
            class="w-full sm:w-auto px-5 py-3 rounded-xl border border-ink-border bg-ink-surface text-xs text-ink-muted hover:text-ink-text hover:bg-ink-surface-raised disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center gap-3 shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <div class="text-left">
              <div class="text-[9px] mono-label text-ink-faint">PREVIOUS TOPIC</div>
              <div class="font-bold text-xs truncate max-w-[180px] text-ink-text">{{ prevNext().prev?.title || 'None' }}</div>
            </div>
          </button>

          <button
            (click)="toggleCompleted()"
            class="px-5 py-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            [ngClass]="prefs.isCompleted(page.id) ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500' : 'border-ink-border bg-ink-surface text-ink-muted hover:text-ink-text'"
          >
            <span>{{ prefs.isCompleted(page.id) ? '✓ Page Completed' : 'Mark Page Complete' }}</span>
          </button>

          <button
            (click)="nextPage()"
            [disabled]="!prevNext().next"
            class="w-full sm:w-auto px-5 py-3 rounded-xl border border-ink-border bg-ink-surface text-xs text-ink-muted hover:text-ink-text hover:bg-ink-surface-raised disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center gap-3 shadow-xs"
          >
            <div class="text-right">
              <div class="text-[9px] mono-label text-ink-faint">NEXT TOPIC</div>
              <div class="font-bold text-xs truncate max-w-[180px] text-ink-text">{{ prevNext().next?.title || 'None' }}</div>
            </div>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    }
  `
})
export class MarkdownReaderComponent {
  formattedContent = computed(() => {
    const page = this.bookService.activePage();
    if (!page) return '';
    try {
      return marked.parse(page.content) as string;
    } catch {
      return page.content;
    }
  });

  constructor(
    public bookService: BookDataService,
    public prefs: PreferencesService,
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

  toggleCompleted() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.prefs.toggleCompleted(this.bookService.activePageId());
  }
}
