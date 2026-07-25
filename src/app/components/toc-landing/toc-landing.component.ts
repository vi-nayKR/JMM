import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDataService } from '../../services/book-data.service';
import { PreferencesService } from '../../services/preferences.service';
import { SoundService } from '../../services/sound.service';
import { ModuleItem, PageItem } from '../../data/book-data';

@Component({
  selector: 'app-toc-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-10 animate-fade-in">
      <!-- Premium Hero Banner & Progress Overview -->
      <div class="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-ink-surface via-ink-surface to-ink-surface-raised border border-ink-border shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <!-- Background Ambient Glow -->
        <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div class="space-y-3 max-w-xl z-10">
          <div class="inline-flex items-center gap-2">
            <span class="mono-label text-[10px] font-bold text-ink-accent px-3 py-1 rounded-full bg-ink-accent/10 border border-ink-accent/20">
              OPERATING SYSTEM & FIELD MANUAL
            </span>
            <span class="text-xs text-ink-faint font-mono">100 Guided Pages</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-bold text-ink-text font-sans tracking-tight leading-tight">
            Money Masterclass
          </h1>

          <p class="text-sm sm:text-base text-ink-muted font-serif leading-relaxed">
            A clean, practical 100-page operating guide for building financial clarity from scratch. Master cash-flow circuits, mindset, financial statement analysis, and asset compounding.
          </p>
        </div>

        <!-- Circular SVG Reading Progress Scorecard -->
        <div class="w-full md:w-auto z-10 flex flex-col sm:flex-row items-center gap-6 bg-ink-surface/80 backdrop-blur-md p-6 rounded-2xl border border-ink-border shadow-sm">
          <div class="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                class="text-ink-border"
                stroke-width="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="text-ink-accent transition-all duration-700 ease-out"
                [attr.stroke-dasharray]="bookService.progressPercentage() + ', 100'"
                stroke-width="3.5"
                stroke-linecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span class="text-xl font-bold text-ink-text">{{ bookService.progressPercentage() }}%</span>
              <span class="text-[9px] text-ink-faint uppercase font-bold">Progress</span>
            </div>
          </div>

          <div class="space-y-3 text-center sm:text-left">
            <div>
              <div class="text-xs font-bold text-ink-text">
                {{ prefs.completedPages().size }} of {{ bookService.data.allPages.length }} Pages Read
              </div>
              <div class="text-[11px] text-ink-faint">
                {{ prefs.bookmarks().size }} Bookmarked Pages
              </div>
            </div>

            <button
              (click)="continueReading()"
              class="w-full px-5 py-2.5 rounded-xl bg-ink-accent text-white font-mono text-xs font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
            >
              <span>Continue Reading</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Jumps & Money Map Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <button
          (click)="openPage('page-4')"
          class="p-5 rounded-2xl border border-ink-border bg-ink-surface hover:border-ink-accent/40 hover:-translate-y-1 transition-all text-left shadow-xs hover:shadow-md group"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="mono-label text-[10px] font-bold text-ink-accent px-2 py-0.5 rounded bg-ink-accent/10">
              CORE FRAMEWORK
            </span>
            <span class="text-xs text-ink-faint group-hover:text-ink-accent group-hover:translate-x-1 transition-all">→</span>
          </div>
          <div class="text-base font-bold text-ink-text font-sans">The Complete Money Map</div>
          <div class="text-xs text-ink-muted font-serif mt-1">4 Layers: Cash flow, Protection, Growth, Freedom</div>
        </button>

        <button
          (click)="openPage('page-105')"
          class="p-5 rounded-2xl border border-ink-border bg-ink-surface hover:border-emerald-500/40 hover:-translate-y-1 transition-all text-left shadow-xs hover:shadow-md group"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="mono-label text-[10px] font-bold text-emerald-500 px-2 py-0.5 rounded bg-emerald-500/10">
              OPERATING SYSTEM
            </span>
            <span class="text-xs text-ink-faint group-hover:text-emerald-500 group-hover:translate-x-1 transition-all">→</span>
          </div>
          <div class="text-base font-bold text-ink-text font-sans">90-Day Money Sprint</div>
          <div class="text-xs text-ink-muted font-serif mt-1">Automated tracking & review rhythm</div>
        </button>

        <button
          (click)="openPage('page-35')"
          class="p-5 rounded-2xl border border-ink-border bg-ink-surface hover:border-purple-500/40 hover:-translate-y-1 transition-all text-left shadow-xs hover:shadow-md group"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="mono-label text-[10px] font-bold text-purple-500 px-2 py-0.5 rounded bg-purple-500/10">
              FINANCIAL ANALYSIS
            </span>
            <span class="text-xs text-ink-faint group-hover:text-purple-500 group-hover:translate-x-1 transition-all">→</span>
          </div>
          <div class="text-base font-bold text-ink-text font-sans">Cash Flow & Statements</div>
          <div class="text-xs text-ink-muted font-serif mt-1">Scorecards, balance sheets & financial ratios</div>
        </button>
      </div>

      <!-- 11 Modules Curriculum Grid -->
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-ink-border pb-3">
          <div>
            <h2 class="mono-label text-sm font-bold text-ink-text tracking-wider">
              CURRICULUM MODULES
            </h2>
            <p class="text-xs text-ink-faint">11 Comprehensive modules covering foundational and advanced capital strategy</p>
          </div>
          <span class="mono-label text-xs text-ink-accent font-bold">11 MODULES</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          @for (mod of bookService.data.modules; track mod.id) {
            <div 
              class="p-6 rounded-2xl border border-ink-border bg-ink-surface hover:border-ink-accent/30 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-5 shadow-xs hover:shadow-lg group"
            >
              <div>
                <div class="flex items-center justify-between gap-2 mb-3">
                  <span class="mono-label text-[10px] px-2.5 py-1 rounded-lg bg-ink-surface-raised border border-ink-border text-ink-accent font-bold">
                    MODULE {{ mod.roman }}
                  </span>
                  <span class="mono-label text-[10px] text-ink-faint font-mono">
                    {{ getModuleCompletedCount(mod) }} / {{ mod.pages.length }} Pages
                  </span>
                </div>

                <h3 
                  (click)="openModuleFirstPage(mod)"
                  class="text-lg font-bold text-ink-text font-sans group-hover:text-ink-accent transition-colors cursor-pointer"
                >
                  {{ mod.title }}
                </h3>

                <!-- Mini Progress Bar per Module -->
                <div class="w-full h-1 bg-ink-border rounded-full overflow-hidden mt-3">
                  <div 
                    class="h-full bg-ink-accent transition-all duration-300"
                    [style.width.%]="getModulePercent(mod)"
                  ></div>
                </div>
              </div>

              <!-- Module Pages Preview Pills -->
              <div class="space-y-1.5 pt-3 border-t border-ink-border">
                @for (page of mod.pages.slice(0, 4); track page.id) {
                  <button
                    (click)="openPage(page.id)"
                    class="w-full text-left text-xs px-3 py-1.5 rounded-lg hover:bg-ink-surface-raised transition-colors truncate flex items-center justify-between text-ink-muted hover:text-ink-text group/page"
                  >
                    <span class="truncate">P.{{ page.pageNumber }} {{ page.title }}</span>
                    @if (prefs.isCompleted(page.id)) {
                      <span class="text-emerald-500 font-bold text-[10px] shrink-0">✓</span>
                    } @else {
                      <span class="text-ink-faint text-[10px] opacity-0 group-hover/page:opacity-100 transition-opacity">Read →</span>
                    }
                  </button>
                }
                @if (mod.pages.length > 4) {
                  <button
                    (click)="openModuleFirstPage(mod)"
                    class="text-[11px] mono-label text-ink-accent hover:underline pt-1 pl-3 font-bold"
                  >
                    + {{ mod.pages.length - 4 }} more topics in Module {{ mod.roman }} →
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class TocLandingComponent {
  constructor(
    public bookService: BookDataService,
    public prefs: PreferencesService,
    private sound: SoundService
  ) {}

  continueReading() {
    this.sound.playClickSound(this.prefs.soundEnabled());
    const lastRead = this.prefs.lastReadPageId();
    this.bookService.setActivePage(lastRead || 'page-5');
    this.prefs.setViewMode('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openPage(pageId: string) {
    this.sound.playClickSound(this.prefs.soundEnabled());
    this.bookService.setActivePage(pageId);
    this.prefs.setViewMode('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openModuleFirstPage(mod: ModuleItem) {
    if (mod.pages.length > 0) {
      this.openPage(mod.pages[0].id);
    }
  }

  getModuleCompletedCount(mod: ModuleItem): number {
    return mod.pages.filter(p => this.prefs.isCompleted(p.id)).length;
  }

  getModulePercent(mod: ModuleItem): number {
    if (!mod.pages.length) return 0;
    return Math.round((this.getModuleCompletedCount(mod) / mod.pages.length) * 100);
  }
}
