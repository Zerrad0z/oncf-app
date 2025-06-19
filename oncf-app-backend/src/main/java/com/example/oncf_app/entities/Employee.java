package com.example.oncf_app.entities;

import com.example.oncf_app.enums.Role;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "employees")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee implements UserDetails {

    @Id
    private String id; // Matricule number (unique identifier)

    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    private String nom;

    private String prenom;

    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "antenne_id")
    @JsonBackReference("antenne-employee")
    private Antenne antenne;

    @OneToMany(mappedBy = "agentCom")
    private List<Epave> epaveEntries;

    @OneToMany(mappedBy = "agentCom")
    private List<FicheInfraction> ficheInfractionEntries;

    @OneToMany(mappedBy = "agentCom")
    private List<CartePerimee> cartePerimeeEntries;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
