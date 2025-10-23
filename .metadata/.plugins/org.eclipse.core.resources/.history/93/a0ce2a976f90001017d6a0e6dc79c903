package com.claim_search.model;

import jakarta.persistence.*;

@Entity
@Table(name = "examiner", schema = "public")
public class Examiner {
    @Id
    @Column(name = "examiner_code")
    private String examinerCode;
    
    @Column(name = "usr_login")
    private String usrLogin;
    
    @Column(name = "examiner_desc")
    private String examinerDesc;
    
    // Getters and setters
    public String getExaminerCode() { return examinerCode; }
    public void setExaminerCode(String examinerCode) { this.examinerCode = examinerCode; }
    
    public String getUsrLogin() { return usrLogin; }
    public void setUsrLogin(String usrLogin) { this.usrLogin = usrLogin; }
    
    public String getExaminerDesc() { return examinerDesc; }
    public void setExaminerDesc(String examinerDesc) { this.examinerDesc = examinerDesc; }
}