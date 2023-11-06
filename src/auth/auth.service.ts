import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { RegisterUserDto, CreateUserDto, UpdateAuthDto, LoginDto } from './dto';

import { User } from './entities/user.entity';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
//import { RegisterUserDto } from './dto/register-user.dto';
//import { RegisterResponse } from './interfaces/register-response';

@Injectable()
export class AuthService {
  //inyectando dependencias para que pueda hacer usuo del create , delete, update
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });

      //para que no regrese el passsword en el json que esta en el newUser
      await newUser.save();
      //eliminando la propiedad password
      const { password: _, ...user } = newUser.toJSON();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exist!`);
      }
      throw new InternalServerErrorException('error en server');
    }
  }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    //en caso de extraer las propiedades
    //const user = await this.create({
    //  email: registerUserDto.email,
    //  name: registerUserDto.name,
    // password: registerUserDto.password,
    //});

    //pero el registerUserDto tiene los datos
    const user = await this.create(registerDto);
    console.log({ user });

    return {
      user: user,
      token: this.getJwtToken({ id: user._id })
    }
  }

  //login responde el LoginResponse
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    console.log({ loginDto });
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('correo no valido');
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      console.log(password, user.password);
      throw new UnauthorizedException('password no valido');
    }

    const { password:_, ...rest } = user.toJSON();

    //mandamos a llamar el metodo getJwtToken en el return;
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }
  }


  findAll(): Promise<User[]> {
    return this.userModel.find();
  }


  //para obtener el id del usuario
  async findUserById( id: string ){
    //buscar el usuario ponemos 
    const user= await this.userModel.findById(id);
    
    //hacemos una desestructuracion para no traer todos los datos del usuario como password
    //y todo lo demas lo ponemos en una variable  llamada rest
    //en rest tenemos toda la informacion del usuario
    //si ponemos el toJSON(); para que no mande los metodos o funciones de la peticion
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  //construyendo token y debe coincidri si la firma es reconocida por mi backend
  getJwtToken(payload: JwtPayload) {
    //mandamos el payload
    const token = this.jwtService.sign(payload);
    //regresamos el token
    return token;
  }
}

/*
async create(createUserDto: CreateUserDto): Promise<User> {
    //  const newUser = new this.userModel(createUserDto);
    //  return newUser.save();
    //con este try controlamos el error
    try {
    //encriptando y desestructurando el password y lo demas lo ponemos en una variable userData con el operador rest
    const { password, ...userData } = createUserDto;

    //crea una isntancia newUSer de UserModel donde la contraseña es igual a l encriptada
    const newUser = new this.userModel({
      //la contraseña es igual ala contraseña encriptada hashSync(password, 10),
      password: bcryptjs.hashSync(password, 10),
      ...userData,
    });
    //se pone el await porque sino sale error y se sale del servicio
    return await newUser.save();

    // const newUser = new this.userModel(createUserDto);
    //  return await newUser.save();
  } catch (error) {
    //console.log(error.code);
    if (error.code === 11000) {
      throw new BadRequestException(`${createUserDto.email} already exist!`);
    }
    throw new InternalServerErrorException('Something terrible happen!');
  }

}
*/