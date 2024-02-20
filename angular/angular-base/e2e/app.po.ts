import { browser, by, element } from 'protractor';

export class AppPage {
  public async navigateTo(): Promise<any> {
    return browser.get('/');
  }

  public async getParagraphText(): Promise<any> {
    return element(by.css('app-root h1')).getText();
  }
}
