import { Component, HostListener } from "@angular/core";
import { ConsoleLoggerService } from "./_services/console-logger.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private logger: ConsoleLoggerService) {}

  isSticky: boolean = false;

  @HostListener("window:scroll", ["$event"])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 250;
  }

  isConnected: boolean = false;
  ws: any;
  retryCount: number = -1;
  reconnectInterval: number = 5;
  reconnectTimeoutId: any;

  ngOnInit() {}

  toTop() {
    window.scrollTo({ top: 0, behavior: `smooth` });
  }
  title = 'angular12';
}
