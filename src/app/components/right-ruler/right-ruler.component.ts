import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDataService } from '../../services/book-data.service';
import { SoundService } from '../../services/sound.service';
import { PreferencesService } from '../../services/preferences.service';

@Component({
  selector: 'app-right-ruler',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="fixed top-14 right-0 bottom-0 w-12 z-20 border-l border-ink-border bg-ink-bg py-4 hidden lg:flex flex-col items-center justify-between select-none">
      <!-- Top page badge (Upright orientation) -->
      <div class="mono-label text-[9px] text-ink-faint font-bold tracking-widest uppercase [writing-mode:vertical-rl]">
        PAGE {{ bookService.activePage()?.pageNumber || 0 }}
      </div>

      <!-- Ruler Track -->
      <div class="relative w-full flex-1 my-6 flex flex-col items-center justify-between">
        <div class="absolute top-0 bottom-0 w-[1px] bg-ink-border left-1/2 -translate-x-1/2"></div>
        
        <!-- Animated Active Scroll Indicator -->
        <div 
          class="absolute w-2.5 h-2.5 rounded-full bg-ink-accent left-1/2 -translate-x-1/2 transition-all duration-150 shadow-sm"
          [style.top.%]="scrollPercent()"
        ></div>

        <!-- Ruler Hashmarks -->
        @for (tick of ticks; track tick) {
          <div 
            class="z-10 w-2 h-[1px] bg-ink-border transition-colors cursor-pointer hover:bg-ink-accent hover:w-4"
            (click)="scrollToPercent(tick)"
          ></div>
        }
      </div>

      <!-- Bottom percentage display -->
      <div class="mono-label text-[9px] font-mono font-bold text-ink-muted">
        {{ scrollPercent() }}%
      </div>
    </aside>
  `
})
export class RightRulerComponent {
  scrollPercent = signal<number>(0);
  ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  constructor(
    public bookService: BookDataService,
    private sound: SoundService,
    private prefs: PreferencesService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
      const pct = Math.min(100, Math.max(0, Math.round((winScroll / height) * 100)));
      this.scrollPercent.set(pct);
    }
  }

  scrollToPercent(pct: number) {
    this.sound.playClickSound(this.prefs.soundEnabled());
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const targetScroll = (height * pct) / 100;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }
}
