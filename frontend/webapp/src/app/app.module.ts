import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { provideAuth } from 'angular2-jwt';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// Services
import {
  ListApiService,
  MarketApiService,

  ApiMapperService,
  ApiService,
  AuthService,
  AuthGuard,
  FavouriteMarketResolver,
  ListCommunicationService,
  ListResolver,
  ListsResolver,
  NavigationService,
  OfferService,
  OptimisationService,
  SharingService,
} from './services';

// Components
import {
  ConfirmComponent,
  FavouriteMarketSettingsComponent,
  ListComponent,
  ListOverviewComponent,
  ListViewComponent,
  LoginComponent,
  NoContentComponent,
  NavigationComponent,
  NavTitleComponent,
  OffersComponent,
  OptimisationComponent,
  RegisterComponent,
  SettingsComponent,
  SettingsOverviewComponent,
  SharedListsSettingsComponent,
} from './components';

// Directives
import { AutoCompletionComponent, AutoCompletionDirective } from './directives/auto-completion';

// Pipes
import {
  FormatNumberPipe,
  OfferFilterPipe,
} from './pipes';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  DragulaService,
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void,
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    AutoCompletionComponent,
    AutoCompletionDirective,
    ConfirmComponent,
    FavouriteMarketSettingsComponent,
    FormatNumberPipe,
    ListViewComponent,
    NoContentComponent,
    NavigationComponent,
    NavTitleComponent,
    ListComponent,
    ListOverviewComponent,
    LoginComponent,
    OffersComponent,
    OfferFilterPipe,
    OptimisationComponent,
    RegisterComponent,
    SettingsComponent,
    SettingsOverviewComponent,
    SharedListsSettingsComponent,
  ],
  entryComponents: [
    AutoCompletionComponent,
    ConfirmComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: false }),
    MaterialModule.forRoot(),
    DragulaModule,
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    provideAuth({
      headerName: 'x-access-token',
      noTokenScheme: true,
    }),
    ListApiService,
    MarketApiService,

    ApiService,
    AuthGuard,
    AuthService,
    ApiMapperService,
    FavouriteMarketResolver,
    ListCommunicationService,
    ListResolver,
    ListsResolver,
    NavigationService,
    OfferService,
    OptimisationService,
    SharingService,
  ],
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.info('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}

