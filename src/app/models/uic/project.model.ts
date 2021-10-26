export interface ProjectModel {
    id?: number;
    enrollment?: EnrollmentModel;
    projectPlan?: ProjectPlanModel;
    title?: string;
    description?: string;
    score?: BigInteger;
    totalAdvance?: BigInteger;
    approved?: boolean;
    tutorAsigned?: boolean;
    observations?: boolean;
}



