/*
    This is the CRUD class. It communicates with the FHIR services by using HTTP GET, POST, DELETE, and PUT
*/

//Angular Imports
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

//JavaScript Imports
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

//Local Imports
import { PatientShared } from '../patients/patient-shared'

@Injectable()
export class FhirService {

    constructor(private _http: Http, private patientShared: PatientShared) { }

    //This method gets all FHIR objects from an endpoint
    //  url: The URL of the endpoint
    getFhirObjects(url: string): Observable<any[]> {

        return this._http.get(this.patientShared.getWindowIp(url))
            .map((response: Response) => <any[]>response.json())
            .catch(this.handleError);
    }

    //This method gets all FHIR objects with a matching parameter from an endpoint
    //  search: The FHIR object's parameter name to search for
    //  param: The FHIR object's parameter value to search for
    //  url: The URL of the endpoint
    getFhirObjectParam(search: string, param: string, url: string): Observable<any[]> {

        let params: URLSearchParams = new URLSearchParams();

        params.set(search.toString(), param.toString());

        return this._http.get(this.patientShared.getWindowIp(url), { search: params })
            .map((response: Response) => <any[]>response.json())
            .catch(this.handleError);
    }

    //This method gets a single FHIR object from an endpoint by matching the ID
    //  id: The ID of the FHIR object
    //  url: The URL of the endpoint
    getOneFhirObject(id: string, url: string): Observable<any> {

        return this._http.get(this.patientShared.getWindowIp(url) + id)
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    //This method deletes a FHIR object from an endpoint by matching the ID
    //  id: The ID of the FHIR object
    //  url: The URL of the endpoint
    deleteOneFhirObject(id: string, url: string): Observable<Response> {

        return this._http.delete(this.patientShared.getWindowIp(url) + id);
    }

    //This method posts a new FHIR object to an endpoint
    //  id: The ID of the FHIR object
    //  jsonData: The FHIR object to post in a JSON String
    //  url: The URL of the endpoint
    postFhirObject(jsonData: string, url: string): Observable<any> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.patientShared.getWindowIp(url), jsonData, { headers: headers })
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    //This method updates a FHIR object on the endpoint
    //  id: The ID of the FHIR object
    //  jsonData: The FHIR object to post in a JSON String
    //  url: The URL of the endpoint
    updateFhirObject(id: string, jsonData: string, url: string): Observable<Response> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put(this.patientShared.getWindowIp(url) + id, jsonData, { headers: headers })
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    //This method handles any errors that happen
    //  error: The endpoint's response
    private handleError(error: Response) {

        console.error(error);

        return Observable.throw(error.json().error || 'Server error');
    }
}