package com.vizuri.fhir.repository;

import java.util.List;

import org.hl7.fhir.dstu3.model.RiskAssessment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiskAssessmentRepository extends MongoRepository<RiskAssessment, String> {
	List<RiskAssessment>findBySubjectReference(String subject);

}
