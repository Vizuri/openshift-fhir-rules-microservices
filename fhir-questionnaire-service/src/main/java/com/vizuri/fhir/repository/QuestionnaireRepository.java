package com.vizuri.fhir.repository;

import org.hl7.fhir.dstu3.model.Questionnaire;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionnaireRepository extends MongoRepository<Questionnaire, String> {
	
}
