package com.vizuri.fhir.test;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.hl7.fhir.dstu3.model.Address;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.hl7.fhir.dstu3.model.Coding;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.Quantity;
import org.hl7.fhir.dstu3.model.QuestionnaireResponse;
import org.hl7.fhir.dstu3.model.StringType;
import org.hl7.fhir.dstu3.model.ContactPoint.ContactPointSystem;
import org.hl7.fhir.dstu3.model.ContactPoint.ContactPointUse;
import org.hl7.fhir.dstu3.model.Enumerations.AdministrativeGender;
import org.hl7.fhir.dstu3.model.Observation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;

import ca.uhn.fhir.context.FhirContext;

public class BundleTest {
	static Logger logger = LoggerFactory.getLogger(BundleTest.class);
	
	public static void main(String arg[]) throws JsonProcessingException {
		testBundleToJSON();
	}
	
	public static void testBundleToJSON() throws JsonProcessingException {
		logger.info("In testPatientToJSON");
		
		Bundle bundle = new Bundle();
		
		
		
		Patient patient = new Patient();
		patient.setId("1");		
		patient.addName().setFamily("Eudy").addGiven("Kent").addGiven("E");
		patient.addAddress().addLine("714 Duncan Place SE").setCity("Leesburg").setState("VA").setPostalCode("20175").setUse(Address.AddressUse.HOME);	
		patient.addTelecom().setValue("703.771.2209").setSystem(ContactPointSystem.PHONE).setUse(ContactPointUse.HOME);
		patient.addTelecom().setValue("703.609.5222").setSystem(ContactPointSystem.PHONE).setUse(ContactPointUse.MOBILE);
		patient.addTelecom().setValue("keudy@vizuri.com").setSystem(ContactPointSystem.EMAIL).setUse(ContactPointUse.HOME);
		patient.addGeneralPractitioner().setDisplay("My Docktor").setReference("333");
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
		patient.setGender(AdministrativeGender.MALE);
		
		
        //Observation Cholesterol
        Observation cholesterol = new Observation();
        cholesterol.setId("Cholesterol");
        //need top set the valueQuantity.value
        CodeableConcept cc1  = new CodeableConcept();
        Coding codingC = new Coding();
        codingC.setCode("2093-3");
        codingC.setDisplay("Cholesterol");
        cc1.addCoding(codingC);
        Quantity q1 = new Quantity();
        q1.setCode("mm[Hg]");
        q1.setUnit("mm[Hg]");
        q1.setValue(159);
        cholesterol.addComponent().setCode(cc1).setValue(q1);
        cholesterol.setValue(q1);
 

        //System.out.println(cholesterol.getComponent().get(0).getCode().getCoding().get(0).getCode());
        System.out.println(cholesterol.getComponent().get(0).getCode().getCoding().get(0).getCode());
        //Observation HDL
        Observation hDL = new Observation();
        hDL.setId("HDL");
        CodeableConcept ccH  = new CodeableConcept();
        Coding codingH = new Coding();
        codingH.setCode("2085-9");
        codingH.setDisplay("HDL");
        ccH.addCoding(codingH);
        Quantity H = new Quantity();
        H.setCode("mm[Hg]");
        H.setUnit("mm[Hg]");
        H.setValue(30);
        hDL.addComponent().setCode(ccH).setValue(H);
        hDL.setValue(H);


        Observation systolicBP = new Observation();
        systolicBP.setId("Systolic Blood Pressure");
        CodeableConcept ccS  = new CodeableConcept();
        Coding codingSystolic = new Coding();
        codingSystolic.setCode("8480-6");
        codingSystolic.setDisplay("Systolic blood pressure");
        ccS.addCoding(codingSystolic);
        Quantity qS = new Quantity();
        qS.setCode("Treated");
        qS.setUnit("mm[Hg]");
        qS.setValue(122);
        systolicBP.addComponent().setCode(ccS).setValue(qS);
        systolicBP.setValue(qS);
        //systolicBP.setCode("Treated");
        
        QuestionnaireResponse questionnaireResponse = new QuestionnaireResponse();
        questionnaireResponse.setId("Smoker Status");


        StringType yes = new StringType("Yes");
        StringType no = new StringType("No");
        questionnaireResponse.addItem().setText("Do you smoke?").addAnswer().setValue(yes);
        questionnaireResponse.addItem().setText("Do you treat your blood pressure?").addAnswer().setValue(yes);


		
		bundle.addEntry().setResource(patient);
		bundle.addEntry().setResource(hDL);
		bundle.addEntry().setResource(cholesterol);
		bundle.addEntry().setResource(systolicBP);
		bundle.addEntry().setResource(questionnaireResponse);
		

			
		FhirContext ctx = FhirContext.forDstu3();
//		String xmlEncoded = ctx.newXmlParser().encodeResourceToString(patient);
		String jsonEncoded = ctx.newJsonParser().encodeResourceToString(bundle);
		
//		logger.info("Patient:" + patient.getId());
		
//		logger.info("Patient XML:" + xmlEncoded);
		
		logger.info("Bundle JSON:" + jsonEncoded);

	}
}
