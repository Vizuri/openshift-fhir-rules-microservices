package com.vizuri.fhir.repository;

import java.util.List;

import org.hl7.fhir.dstu3.model.QuestionnaireResponse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface QuestionnaireResponseRepository extends MongoRepository<QuestionnaireResponse, String> {
	List<QuestionnaireResponse> findBySubjectReference(String subject);
	List<QuestionnaireResponse> findByQuestionnaireReference(String questionnaire);
	List<QuestionnaireResponse> findByQuestionnaireReferenceAndSubjectReference(String questionnaire, String subject);
	
}
