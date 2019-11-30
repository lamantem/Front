import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
  }

  // transform(gendataSource:GenData[], searchTerm : string ) : GroupsReader[]{
  //   if(!groupsReaderDataSource || !searchTerm){
  //     return groupsReaderDataSource;
  //   }
  //
  //   return groupsReaderDataSource.filter(groupsReaderDataSource =>
  //       groupsReaderDataSource.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  // }
}

