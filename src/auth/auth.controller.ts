import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request
} from "@nestjs/common";
import { AuthService } from './auth.service';

//importado los dto a un solo archivo index
//import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateAuthDto } from './dto/update-auth.dto';
//import { LoginDto } from './dto/login.dto';
//import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserDto, LoginDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';




@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);

    return this.authService.create(createUserDto);
  }

  //1) hacer el endpoint en el controllers
  //2) hacer en el servicio auth.service.tscrear login para que regrese el usaurio y token de acceso
  //3) crear un login dto.ts
  //4) recibir el body del metodo login()

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    //return 'login funciona'; le enviamos los datos con loginDto
    //y tambien lo recibe el servicio
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registerDto: RegisterUserDto) {
    console.log(registerDto);
    return this.authService.register(registerDto);
  }

  //ponemos el guard con el nombre del componente que queremos restriccion
  @UseGuards(AuthGuard)
  @Get()
  findAll( @Request() req: Request) {
    //request del controlador 
    //console.log(req);
   
    
    //const user= req['user'];
    //return user;
    return this.authService.findAll();

  }


  // LoginResponse
  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req: Request ): LoginResponse {
      
    const user = req['user'] as User;

    return {
      user,
      token: this.authService.getJwtToken({ id: user._id })
    }

  }


  //@Get(':id')
  //findOne(@Param('id') id: string) {
  //  return this.authService.findOne(+id);
  //}

  //@Patch(':id')
  //update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //  return this.authService.update(+id, updateAuthDto);
  //}

  //@Delete(':id')
  //remove(@Param('id') id: string) {
  //  return this.authService.remove(+id);
  //}

}
