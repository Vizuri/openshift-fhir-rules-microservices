/*
 * Copyright 2015 Vizuri, a business division of AEM Corporation
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

package com.vizuri.fhir;

import static org.junit.Assert.*;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.Enumerations.AdministrativeGender;
import org.hl7.fhir.dstu3.model.Address.AddressUse;
import org.hl7.fhir.dstu3.model.Age;
import org.hl7.fhir.dstu3.model.ContactPoint.ContactPointUse;
import org.hl7.fhir.dstu3.model.ContactPoint.ContactPointSystem;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;

import com.vizuri.fhir.repository.PatientRepository;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations="classpath:application-test.properties")

public class FhirPatientServiceApplicationJUnitTests {
	
	private static Logger logger =LoggerFactory.getLogger(FhirPatientServiceApplicationJUnitTests.class);
	
	@Autowired
	PatientRepository repository;
	
	
	@Before
	public void init(){
		
		repository.deleteAll();
		
		Patient patient1 = new Patient();
		patient1.setId("123");
		patient1.setGender(AdministrativeGender.MALE);
		patient1.addName().setFamily("Eudy").addGiven("Ryan").addGiven("Francis");
		patient1.addAddress().addLine("714 Duncan Pl SE").setCity("Leesburg").setState("VA").setPostalCode("20175").setUse(AddressUse.HOME);
		patient1.addTelecom().setValue("703.609.6644").setSystem(ContactPointSystem.PHONE).setUse(ContactPointUse.MOBILE).setRank(2);
		patient1.addTelecom().setValue("703.771.2209").setSystem(ContactPointSystem.PHONE).setUse(ContactPointUse.HOME).setRank(1);
		patient1.addTelecom().setValue("reudy@verizon.net").setSystem(ContactPointSystem.EMAIL);
		patient1.setActive(true);
		patient1.setLanguage("English");
	
		DateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		Date birthDate;
		try {
			birthDate = formatter.parse("04/18/1997");
			patient1.setBirthDate(birthDate);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		System.out.println(patient1.getBirthDate());
		LocalDate birthdate = patient1.getBirthDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		System.out.println(birthdate);
	    LocalDate today = LocalDate.now();
	    System.out.println(today);
	    Period period = Period.between(birthdate, today);
	    System.out.println(period.getYears());
		
		repository.save(patient1);
		logger.info("Init Complete");
	}
	
	
	@Test
	public void testFindById() {
		Patient response = repository.findOne("123");

		logger.info(">>>> FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testFindAll() {
		List<Patient> response = repository.findAll();
		for (Patient patient : response) {
			logger.info(">>>>> Found:" + patient.getId());
		}
        assertTrue(response.size() > 0);
	}
	@Test
	public void testCreate() {
		String id = "12345";
		
		Patient patient1 = new Patient();
		patient1.setId(id);
		repository.save(patient1);
		
		Patient response = repository.findOne(id);

		logger.info(">>>> Create FindById:" + response.getId());
		assertNotNull(response);
	}
	@Test
	public void testWrongIdFindById() {
		Patient response = repository.findOne("Wrong");
		logger.info(">>>> Wrong Id FindById");
		assertNull(response);
	}
	
	@Test 
	public void testUpdate() {
		Patient response = repository.findOne("123");
		
		repository.save(response);
	
		//assertNull(response);
	}
	
	@Test 
	public void testDelete() {
		repository.delete("123");
		
		Patient response = repository.findOne("123");
		logger.info(">>>> Delete 123");
		assertNull(response);
	}
	

}
