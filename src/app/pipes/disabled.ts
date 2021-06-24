import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'disabled'})
export class DisablePipe implements PipeTransform {
    // Maybe you need additional params
    transform(data: any[] | any) {
        // Do you loop over the array

        return null//result;
    }   

}