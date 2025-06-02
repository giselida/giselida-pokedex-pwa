import {
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  OutputEmitterRef,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  imports: [FormsModule, ReactiveFormsModule],
  selector: 'app-pokedex',
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
})
export class PokedexComponent implements OnInit, OnDestroy {
  pageSize: OutputEmitterRef<number> = output();
  searchType: OutputEmitterRef<string> = output();
  pageIndex: OutputEmitterRef<number> = output();
  favoriteFilter: OutputEmitterRef<boolean> = output();
  currentFavoriteFilterValue = signal(false);
  name = new FormControl();
  currentPageIndex = signal(0);
  isFirstPage = computed(() => this.currentPageIndex() === 0);
  isLastPage = computed(() => this.currentPageIndex() >= this.totalPages() - 1);
  count = input<number>();
  currentPageSize = input<number>();
  totalPages = computed(() => {
    const size = this.currentPageSize();
    const total = this.count();
    return size && size > 0 && total && total >= 0
      ? Math.ceil(total / size)
      : 0;
  });

  screenRef = viewChild<ElementRef<HTMLDivElement>>('screenRef');

  scrollAmount = 100;

  scrollIntervalId: any;

  startScroll(direction: 'up' | 'down') {
    const $element = this.screenRef()?.nativeElement;
    if (!$element || this.scrollIntervalId) return;
    const step = direction === 'up' ? -this.scrollAmount : this.scrollAmount;

    this.scrollIntervalId = setInterval(() => {
      $element.scrollBy({ top: step });
    }, 100);
  }

  stopScroll() {
    if (this.scrollIntervalId) {
      clearInterval(this.scrollIntervalId);
      this.scrollIntervalId = null;
    }
  }

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.name.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe((value) => {
        this.resetPage();
        this.searchType.emit(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  favoriteFilterEvent() {
    this.currentFavoriteFilterValue.set(!this.currentFavoriteFilterValue());
    this.favoriteFilter.emit(this.currentFavoriteFilterValue());
  }

  nextPage() {
    if (this.currentPageIndex() < this.totalPages() - 1) {
      this.currentPageIndex.update((value) => value + 1);
      this.pageIndex.emit(this.currentPageIndex());
    }
  }

  previewPage() {
    if (this.currentPageIndex() > 0) {
      this.currentPageIndex.update((value) => value - 1);
      this.pageIndex.emit(this.currentPageIndex());
    }
  }

  resetPage() {
    this.currentPageIndex.set(0);
    this.pageIndex.emit(0);
  }

  goToFirstPage() {
    this.resetPage();
  }

  goToLastPage() {
    this.currentPageIndex.set(this.totalPages() - 1);
    this.pageIndex.emit(this.currentPageIndex());
  }
}
