import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookDataService, SearchResult } from '../../services/book-data.service';
import { PreferencesService } from '../../services/preferences.service';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div 
        class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-20 animate-fade-in"
        (click)="onClose()"
      >
        <div 
          class="w-full max-w-2xl bg-ink-surface border border-ink-border rounded-xl shadow-2xl overflow-hidden animate-scale-up"
          (click)="$event.stopPropagation()"
        >
          <!-- Search Input Box -->
          <div class="relative flex items-center px-4 border-b border-ink-border">
            <svg class="w-5 h-5 text-ink-muted shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
              #searchInput
              type="text"
              [(ngModel)]="query"
              (ngModelChange)="onSearchChange()"
              placeholder="Search concepts, modules, or rules (e.g., inflation, cash flow, debt)..."
              class="w-full py-4 bg-transparent text-ink-text placeholder-ink-faint text-sm outline-none font-sans"
            />

            @if (query) {
              <button 
                (click)="clearQuery()" 
                class="p-1 rounded hover:bg-ink-surface-raised text-ink-faint hover:text-ink-text"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            }
          </div>

          <!-- Results List -->
          <div class="max-h-[60vh] overflow-y-auto p-2">
            @if (results.length > 0) {
              <div class="space-y-1">
                @for (res of results; track res.page.id) {
                  <button
                    (click)="selectResult(res.page.id)"
                    class="w-full text-left p-3 rounded-lg hover:bg-ink-surface-raised transition-colors group flex flex-col gap-1 border border-transparent hover:border-ink-border"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="mono-label text-[10px] px-1.5 py-0.5 rounded bg-ink-accent/10 text-ink-accent font-bold">
                          Page {{ res.page.pageNumber }}
                        </span>
                        <span class="text-xs font-bold text-ink-text group-hover:text-ink-accent transition-colors">
                          {{ res.page.title }}
                        </span>
                      </div>
                      <span class="mono-label text-[10px] text-ink-faint">
                        {{ res.page.moduleTitle || 'Overview' }}
                      </span>
                    </div>
                    <p class="text-xs text-ink-muted line-clamp-2 font-serif pl-0.5">
                      {{ res.snippet }}
                    </p>
                  </button>
                }
              </div>
            } @else if (query.trim()) {
              <div class="py-12 text-center text-ink-faint text-xs">
                No matching results found for "<span class="font-bold text-ink-muted">{{ query }}</span>"
              </div>
            } @else {
              <!-- Popular Jumps / Quick Shortcuts -->
              <div class="p-4 space-y-3">
                <div class="mono-label text-[10px] text-ink-faint font-bold">POPULAR TOPICS & MAPS</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    (click)="selectResult('page-4')"
                    class="text-left p-2.5 rounded border border-ink-border hover:bg-ink-surface-raised hover:border-ink-accent/30 transition-all flex items-center gap-2"
                  >
                    <span class="w-6 h-6 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">🗺️</span>
                    <div>
                      <div class="text-xs font-bold text-ink-text">The Money Map</div>
                      <div class="text-[10px] text-ink-faint">4 core layers of finance</div>
                    </div>
                  </button>

                  <button
                    (click)="selectResult('page-5')"
                    class="text-left p-2.5 rounded border border-ink-border hover:bg-ink-surface-raised hover:border-ink-accent/30 transition-all flex items-center gap-2"
                  >
                    <span class="w-6 h-6 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">⚡</span>
                    <div>
                      <div class="text-xs font-bold text-ink-text">Stored Life Energy</div>
                      <div class="text-[10px] text-ink-faint">Module 1 - Foundation</div>
                    </div>
                  </button>

                  <button
                    (click)="selectResult('page-105')"
                    class="text-left p-2.5 rounded border border-ink-border hover:bg-ink-surface-raised hover:border-ink-accent/30 transition-all flex items-center gap-2"
                  >
                    <span class="w-6 h-6 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">🚀</span>
                    <div>
                      <div class="text-xs font-bold text-ink-text">90-Day Money OS</div>
                      <div class="text-[10px] text-ink-faint">Module 11 - System</div>
                    </div>
                  </button>

                  <button
                    (click)="selectResult('page-35')"
                    class="text-left p-2.5 rounded border border-ink-border hover:bg-ink-surface-raised hover:border-ink-accent/30 transition-all flex items-center gap-2"
                  >
                    <span class="w-6 h-6 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs">📊</span>
                    <div>
                      <div class="text-xs font-bold text-ink-text">Analyzing Money</div>
                      <div class="text-[10px] text-ink-faint">Module 4 - Statements</div>
                    </div>
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Footer Shortcut Bar -->
          <div class="px-4 py-2 bg-ink-surface-raised border-t border-ink-border flex items-center justify-between text-[11px] text-ink-faint">
            <span>Press <kbd class="px-1 py-0.5 rounded bg-ink-surface border border-ink-border font-mono text-[9px]">ESC</kbd> to close</span>
            <span>Money Masterclass Search Engine</span>
          </div>
        </div>
      </div>
    }
  `
})
export class SearchModalComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  query: string = '';
  results: SearchResult[] = [];

  constructor(
    public bookService: BookDataService,
    private prefs: PreferencesService,
    private sound: SoundService
  ) {}

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.isOpen ? this.onClose() : this.onOpen();
    } else if (event.key === 'Escape' && this.isOpen) {
      this.onClose();
    }
  }

  onOpen() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    }, 50);
  }

  onClose() {
    this.close.emit();
    this.query = '';
    this.results = [];
  }

  onSearchChange() {
    this.results = this.bookService.search(this.query);
  }

  clearQuery() {
    this.query = '';
    this.results = [];
    this.searchInput?.nativeElement.focus();
  }

  selectResult(pageId: string) {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.bookService.setActivePage(pageId);
    this.prefs.setViewMode('reader');
    this.onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
