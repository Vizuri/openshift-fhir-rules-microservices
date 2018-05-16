package com.vizuri.fhir.model;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.camel.dataformat.bindy.annotation.CsvRecord;

import org.apache.camel.dataformat.bindy.annotation.DataField;
@XmlRootElement
@CsvRecord(separator = ",")
public class Patient {
	@DataField(pos = 1)
	private String id;
	@DataField(pos = 2)
	private String firstName;
	@DataField(pos = 3)
	private String lastName;
	@DataField(pos = 4)
	private String gender;
	@DataField(pos = 5)
	private String birthDate;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getBirthDate() {
		return birthDate;
	}
	public void setBirthDate(String birthDate) {
		this.birthDate = birthDate;
	}

	
}
