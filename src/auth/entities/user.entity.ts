import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  _id?: string;

  //unique: true, crea un index en automatico
  //campo requerido y campos unicos
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ minlength: 6, required: true })
  password?: string;

  //crea un usuario por defecto
  @Prop({ default: true })
  isActive: boolean;

  //[ 'user', 'admin'] y valor por defecto es un user
  @Prop({ type: [String], default: ['user'] })
  roles: string[];
}

//crea la bd en mongo
export const UserSchema = SchemaFactory.createForClass(User);
