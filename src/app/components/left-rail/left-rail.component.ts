import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDataService } from '../../services/book-data.service';
import { PreferencesService } from '../../services/preferences.service';
import { SoundService } from '../../services/sound.service';
import { PageItem } from '../../data/book-data';

@Component({
  selector: 'app-left-rail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Mobile Backdrop Overlay -->
    @if (isOpen) {
      <div 
        class="fixed inset-0 top-14 bg-slate-950/60 backdrop-blur-xs z-30 md:hidden animate-fade-in"
        (click)="onClose()"
      ></div>
    }

    <!-- Slim Desktop Icon Rail (When collapsed) -->
    @if (!isOpen) {
      <aside class="fixed top-14 left-0 bottom-0 w-14 z-20 border-r border-ink-border bg-ink-bg overflow-y-auto overflow-x-hidden py-3 hidden md:flex flex-col items-center gap-1">
        <button
          (click)="onToggleOpen()"
          class="icon-btn p-1.5 rounded text-ink-faint hover:text-ink-text mb-2"
          title="Expand navigation"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>

        <button
          (click)="selectPage('page-1')"
          title="How to Use"
          class="icon-btn w-9 h-9 flex items-center justify-center rounded text-ink-muted hover:text-ink-accent hover:bg-ink-surface-raised"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </button>

        <div class="w-6 border-t border-ink-border my-1"></div>

        @for (mod of bookService.data.modules; track mod.id) {
          <button
            (click)="toggleModule(mod.id)"
            [title]="mod.title"
            class="icon-btn mono-label w-9 h-9 shrink-0 flex items-center justify-center rounded text-[10px]"
            [ngClass]="bookService.activeModule()?.id === mod.id ? 'text-ink-accent font-bold bg-ink-accent/10' : 'text-ink-muted'"
          >
            {{ mod.roman }}
          </button>
        }

        <div class="w-6 border-t border-ink-border my-1"></div>

        <button
          (click)="selectPage('page-4')"
          title="Money Map"
          class="icon-btn w-9 h-9 flex items-center justify-center rounded text-ink-muted hover:text-ink-accent hover:bg-ink-surface-raised"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </button>
      </aside>
    }

    <!-- Full Sidebar (Mobile Drawer + Desktop Sidebar) -->
    <aside
      class="fixed top-14 left-0 bottom-0 w-[280px] max-w-[85vw] z-40 md:z-20 border-r border-ink-border bg-ink-bg overflow-y-auto py-4 px-3 flex flex-col gap-3 transition-transform duration-300 ease-out shadow-2xl md:shadow-none"
      [ngClass]="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Top header bar inside sidebar -->
      <div class="flex items-center justify-between">
        <button
          (click)="openDashboard()"
          class="icon-btn flex items-center gap-1.5 mono-label text-[11px] text-ink-muted hover:text-ink-accent px-2 py-1.5 rounded border border-ink-border"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard View
        </button>

        <button
          (click)="onToggleOpen()"
          class="icon-btn flex p-1.5 rounded text-ink-faint hover:text-ink-text"
          title="Close menu"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Intro / Foundation Links -->
      <div class="space-y-1">
        <div class="mono-label px-2 py-1 text-[10px] text-ink-faint font-bold">INTRO & OVERVIEW</div>
        @for (page of bookService.data.introPages; track page.id) {
          <button
            (click)="selectPage(page.id)"
            class="w-full text-left text-xs min-h-[38px] px-3 py-2 rounded-lg transition-colors truncate flex items-center justify-between active:scale-98"
            [ngClass]="bookService.activePageId() === page.id ? 'text-ink-accent font-bold bg-ink-accent/10' : 'text-ink-muted hover:text-ink-text'"
          >
            <span class="truncate">{{ page.title }}</span>
            @if (prefs.isCompleted(page.id)) {
              <span class="text-emerald-500 text-xs font-bold">✓</span>
            }
          </button>
        }
      </div>

      <!-- Modules Accordion -->
      <div class="space-y-1 mt-2">
        <div class="mono-label px-2 py-1 text-[10px] text-ink-faint font-bold">11 MODULES</div>

        @for (mod of bookService.data.modules; track mod.id) {
          <div class="space-y-0.5">
            <button
              (click)="toggleModule(mod.id)"
              class="w-full text-left text-xs min-h-[38px] px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between gap-2 active:scale-98"
              [ngClass]="bookService.activeModule()?.id === mod.id ? 'text-ink-accent font-bold' : 'text-ink-muted hover:text-ink-text'"
            >
              <span class="flex items-center gap-2 truncate">
                <span class="mono-label text-[10px] text-ink-faint shrink-0 font-mono">{{ mod.roman }}</span>
                <span class="truncate">{{ mod.title }}</span>
              </span>
              <svg 
                class="w-3.5 h-3.5 shrink-0 transition-transform" 
                [ngClass]="isModuleExpanded(mod.id) ? 'rotate-90' : ''"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Expanded Module Pages -->
            @if (isModuleExpanded(mod.id)) {
              <div class="ml-3 pl-2 border-l border-ink-border space-y-0.5 pt-0.5 pb-1">
                @for (page of mod.pages; track page.id) {
                  <button
                    (click)="selectPage(page.id)"
                    class="w-full text-left text-xs min-h-[36px] px-2.5 py-1.5 rounded-lg transition-colors truncate flex items-center justify-between gap-1.5 active:scale-98"
                    [ngClass]="bookService.activePageId() === page.id ? 'text-ink-accent font-bold bg-ink-accent/10' : 'text-ink-muted hover:text-ink-text'"
                  >
                    <span class="mono-label text-[9px] text-ink-faint shrink-0 font-mono">P.{{ page.pageNumber }}</span>
                    <span class="truncate">{{ page.title }}</span>
                    @if (prefs.isCompleted(page.id)) {
                      <span class="text-emerald-500 text-xs font-bold shrink-0">✓</span>
                    }
                  </button>
                }
              </div>
            }
          </div>
        }
      </div>
    </aside>
  `
})
export class LeftRailComponent {
  @Input() isOpen: boolean = false;
  @Output() toggleOpen = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor(
    public bookService: BookDataService,
    public prefs: PreferencesService,
    private sound: SoundService
  ) {}

  onToggleOpen() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.toggleOpen.emit();
  }

  onClose() {
    this.close.emit();
  }

  toggleModule(modId: number) {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.bookService.toggleModule(modId);
  }

  isModuleExpanded(modId: number): boolean {
    return !!this.bookService.expandedModules()[modId];
  }

  selectPage(pageId: string) {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.bookService.setActivePage(pageId);
    this.prefs.setViewMode('reader');
    if (window.innerWidth < 768) {
      this.onClose();
    }
  }

  openDashboard() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.prefs.setViewMode('landing');
    if (window.innerWidth < 768) {
      this.onClose();
    }
  }
}
