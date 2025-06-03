import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  OutputEmitterRef,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HoldScrollDirective } from '../../directive/hold-scroll';
import { LoadingService } from '../../services/loading/loading';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HoldScrollDirective],
  selector: 'pokedex',
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
})
export class PokedexComponent implements OnInit, OnDestroy {
  pageSize: OutputEmitterRef<number> = output();
  searchType: OutputEmitterRef<string> = output();
  pageIndex: OutputEmitterRef<number> = output();
  favoriteFilter: OutputEmitterRef<boolean> = output();
  loading = inject(LoadingService).loading;

  count = input<number>();
  currentPageSize = input<number>();

  currentFavoriteFilterValue = signal(false);
  currentPageIndex = signal(0);

  isFirstPage = computed(() => this.currentPageIndex() === 0);
  isLastPage = computed(() => this.currentPageIndex() >= this.totalPages() - 1);
  totalPages = computed(() => {
    const size = this.currentPageSize();
    const total = this.count();
    return size && size > 0 && total && total >= 0
      ? Math.ceil(total / size)
      : 0;
  });

  name = new FormControl();
  scrollAmount = 100;

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

  emitPage(page: number) {
    this.pageSize.emit(page);
    this.resetPage();
  }

  favoriteFilterEvent() {
    this.currentFavoriteFilterValue.set(!this.currentFavoriteFilterValue());
    this.favoriteFilter.emit(this.currentFavoriteFilterValue());
    this.resetPage();
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
