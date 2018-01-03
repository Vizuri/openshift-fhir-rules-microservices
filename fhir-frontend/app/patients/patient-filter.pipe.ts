/*
    This pipe filter out patients in order to search for them in the UI
*/

//Angular Imports
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({

    name: 'patientFilter'
})
export class PatientFilterPipe implements PipeTransform {

    transform(value: any[], filterBy: string): any[] {

        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;

        return filterBy ? value.filter((patient: any) =>

            (patient.name[0].family.toLocaleLowerCase().indexOf(filterBy) !== -1)
            || (patient.id.toLocaleLowerCase().indexOf(filterBy) !== -1)
            || (patient.name[0].text.toLocaleLowerCase().indexOf(filterBy) !== -1)

        ) : value;
    }
}