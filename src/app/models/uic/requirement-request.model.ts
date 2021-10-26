export interface RequirementRequestModel {
    id?: number;
    requirement?: RequirementModel;
    meshStudent?: MeshStudentModel;
    registeredAt?: date;
    approved?: boolean;
    observations?: array;
}



