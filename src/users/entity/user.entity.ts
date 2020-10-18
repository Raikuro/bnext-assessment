import { Contact } from './contact.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  phone: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @ManyToMany(type => Contact, { cascade: true })
  @JoinTable({
    name: "user_contacts",
    joinColumn: { name: "user", referencedColumnName: "phone" },
    inverseJoinColumn: { name: "contact", referencedColumnName: "phone" }
  })
  contacts: Contact[];
}
