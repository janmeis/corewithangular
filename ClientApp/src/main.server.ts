import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModule, renderModuleFactory } from '@angular/platform-server';
import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode, StaticProvider, Inject } from '@angular/core';
import { createServerRenderer, BootFuncParams } from 'aspnet-prerendering';
export { AppServerModule } from './app/app.server.module';

enableProdMode();

const getBaseUrl = (params: BootFuncParams) => {
  return params.origin + params.baseUrl.slice(0, -1);
}

export default createServerRenderer(params => {
  const { AppServerModule, AppServerModuleNgFactory, LAZY_MODULE_MAP } = (module as any).exports;

  const providers: StaticProvider[] = [
    { provide: APP_BASE_HREF, useValue: params.baseUrl },
    { provide: 'BOOT_PARAMS', useValue: params },
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: ['BOOT_PARAMS'] },
    { provide: 'SERVERSIDE', useValue: true },
  ];

  const options = {
    document: params.data.originalHtml,
    url: params.url,
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP),
      { provide: APP_BASE_HREF, useValue: params.baseUrl },
      { provide: 'BASE_URL', useValue: params.origin + params.baseUrl },
      { provide: 'MESSAGE', useValue: params.data.message }
    ] as StaticProvider[]
  };

  // Bypass ssr api call cert warnings in development
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const renderPromise = AppServerModuleNgFactory
    ? /* AoT */ renderModuleFactory(AppServerModuleNgFactory, options)
    : /* dev */ renderModule(AppServerModule, options);

  return renderPromise.then(html => ({ html }));
});

export { renderModule, renderModuleFactory } from '@angular/platform-server';
function provideModuleMap(LAZY_MODULE_MAP: any) {
  throw new Error('Function not implemented.');
}

