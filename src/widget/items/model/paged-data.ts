import { Page } from './page.class';
export class PagedData<T> {
  results = new Array<T>();
  page = new Page();
  datas:any;
  PitchSubmitted:any;
}