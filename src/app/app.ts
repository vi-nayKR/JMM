import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LeftRailComponent } from './components/left-rail/left-rail.component';
import { RightRulerComponent } from './components/right-ruler/right-ruler.component';
import { SearchModalComponent } from './components/search-modal/search-modal.component';
import { TocLandingComponent } from './components/toc-landing/toc-landing.component';
import { MarkdownReaderComponent } from './components/markdown-reader/markdown-reader.component';
import { PreferencesService } from './services/preferences.service';
import { BookDataService } from './services/book-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    LeftRailComponent,
    RightRulerComponent,
    SearchModalComponent,
    TocLandingComponent,
    MarkdownReaderComponent
  ],
  template: `
    <div class="min-h-screen bg-ink-bg text-ink-text flex flex-col font-sans transition-colors duration-200">
      <!-- Header Bar -->
      <app-header
        (toggleSidebar)="sidebarOpen.set(!sidebarOpen())"
        (openSearch)="searchOpen.set(true)"
      ></app-header>

      <!-- Main Layout Workspace -->
      <div class="flex-1 pt-14 flex relative">
        <!-- Left Collapsible Sidebar -->
        <app-left-rail
          [isOpen]="sidebarOpen()"
          (toggleOpen)="sidebarOpen.set(!sidebarOpen())"
          (close)="sidebarOpen.set(false)"
        ></app-left-rail>

        <!-- Dynamic Main Content View -->
        <main 
          class="flex-1 min-w-0 transition-all duration-300 pb-20"
          [ngClass]="{
            'md:ml-[270px]': sidebarOpen(),
            'md:ml-14': !sidebarOpen(),
            'lg:mr-12': prefs.viewMode() === 'reader'
          }"
        >
          @if (prefs.viewMode() === 'landing') {
            <app-toc-landing></app-toc-landing>
          } @else {
            <app-markdown-reader></app-markdown-reader>
          }
        </main>

        <!-- Right Vertical Reading Ruler (Desktop Reader Mode) -->
        @if (prefs.viewMode() === 'reader') {
          <app-right-ruler></app-right-ruler>
        }
      </div>

      <!-- Global Search Modal -->
      <app-search-modal
        [isOpen]="searchOpen()"
        (close)="searchOpen.set(false)"
      ></app-search-modal>
    </div>
  `
})
export class App {
  sidebarOpen = signal<boolean>(true);
  searchOpen = signal<boolean>(false);

  constructor(
    public prefs: PreferencesService,
    public bookService: BookDataService
  ) {}
}
