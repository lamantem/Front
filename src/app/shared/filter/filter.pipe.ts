import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
  }

  // transform(groupsReaderDataSource:GroupsReader[], searchTerm : string ) : GroupsReader[]{
  //   if(!groupsReaderDataSource || !searchTerm){
  //     return groupsReaderDataSource;
  //   }
  //
  //   return groupsReaderDataSource.filter(groupsReaderDataSource =>
  //       groupsReaderDataSource.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  // }
}

