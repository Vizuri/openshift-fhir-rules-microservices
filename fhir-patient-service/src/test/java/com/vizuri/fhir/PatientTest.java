package com.vizuri.fhir;

import static org.junit.Assert.*;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.swing.text.DateFormatter;

import org.hl7.fhir.dstu3.model.Address;
import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.hl7.fhir.dstu3.model.ContactPoint.ContactPointSystem;
import org.hl7.fhir.dstu3.model.ContactPoint.ContactPointUse;
import org.hl7.fhir.dstu3.model.Enumerations.AdministrativeGender;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.codesystems.AddressUse;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import ca.uhn.fhir.context.FhirContext;

import ca.uhn.fhir.model.primitive.DateDt;

public class PatientTest {
	Logger logger = LoggerFactory.getLogger(PatientTest.class);

//	@Test
	public void testPatientToJSON() throws JsonProcessingException {
		logger.info("In testPatientToJSON");
		Patient patient = new Patient();
		
		
		//patient.addIdentifier().setValue("123");
		//patient.addIdentifier().setUse(IdentifierUseEnum.OFFICIAL).setValue("7000135").setType(IdentifierTypeCodesEnum.);
		//patient.addIdentifier().setUse(IdentifierUseEnum.SECONDARY).setValue("3287486");
		patient.setId("1");		

		patient.addName().setFamily("Eudy").addGiven("Kent").addGiven("E");

		patient.addAddress().addLine("714 Duncan Place SE").setCity("Leesburg").setState("VA").setPostalCode("20175").setUse(Address.AddressUse.HOME);
		
		
		patient.addTelecom().setValue("703.771.2209").setSystem(ContactPointSystem.PHONE).setUse(ContactPointUse.HOME);
		patient.addTelecom().setValue("703.609.5222").setSystem(ContactPointSystem.PHONE).setUse(ContactPointUse.MOBILE);
		patient.addTelecom().setValue("keudy@vizuri.com").setSystem(ContactPointSystem.EMAIL).setUse(ContactPointUse.HOME);
	    
		patient.addGeneralPractitioner().setDisplay("My Docktor").setReference("333");

		//patient.addContact().
		
		patient.setActive(true);
		DateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		Date birthDate;
		try {
			birthDate = formatter.parse("09/10/1964");
			patient.setBirthDate(birthDate);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//DateDt birthDate = new DateDt(1964,8,10);
		

		patient.setGender(AdministrativeGender.MALE);
		//patient.setMaritalStatus(CodeableConcept.);
	
		
		FhirContext ctx = FhirContext.forDstu3();
		String xmlEncoded = ctx.newXmlParser().encodeResourceToString(patient);
		String jsonEncoded = ctx.newJsonParser().encodeResourceToString(patient);
		
		logger.info("Patient:" + patient.getId());
		
		logger.info("Patient XML:" + xmlEncoded);
		
		logger.info("Patient JSON:" + jsonEncoded);
		 
		//patient.setGender(AdministrativeGenderEnum.MALE);
		
		//patient.addName().addFamily("Smith").addGiven("John").addGiven("Q").addSuffix("Junior");
		//patient.setId("1233");
		


		//patient.setActive(true);

		//ObjectMapper om = new ObjectMapper();

		//System.out.println("Patient:" + om.writeValueAsString(patient));
	}

	//@Test
	public void testJSONToPatient() throws IOException {
		logger.info("In testJSONToPatient");
		//ObjectMapper om = new ObjectMapper();
		//Patient patient = om.readValue(new File("/Users/keudy/DEMOAPP/workspace/fhir-resources/src/test/resources/examples-json/patient-example.json"), Patient.class);
		FhirContext ctx = FhirContext.forDstu2();

		FileReader fileReader = new FileReader("/Users/keudy/DEMOAPP/workspace/fhir-resources/src/test/resources/examples-json/patient-example.json");
		Patient patient = (Patient) ctx.newJsonParser().parseResource(fileReader);		
		logger.info("Patient:" + patient.getName());
	}
}
