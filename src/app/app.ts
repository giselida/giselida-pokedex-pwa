import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading/loading';

@Component({
  standalone: true,
  selector: 'root',
  imports: [RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './app.html',
})
export class AppComponent {
  loading = inject(LoadingService).loading;
}
