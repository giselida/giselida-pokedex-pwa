import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading/loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './app.html',
})
export class App {
  loading = inject(LoadingService).loading;
}
