import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor( private jwtService: JwtService,
               private authService: AuthService, ) {}

  //los tipos de datos que puede regresar  en el canActive y puede usar cualquiera de estos valores con un true
  // boolean valor | Promise<boolean> resuleve | Observable<boolean> emite
  //
  //canActivate(  context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //  return true;
  //}
  //}
 
//context: ExecutionContext permite ver el acceso la peticion al que tiene autorizacion
 async canActivate(context: ExecutionContext): Promise<boolean> {
  // el request tiene la peticion del url 
    const request = context.switchToHttp().getRequest();
    //console.log({ request });

    const token = this.extractTokenFromHeader(request);
   

    if (!token) {
      throw new UnauthorizedException('No hay token en la peticion');
    }

    console.log({ token });

     try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
      //esta es la variable de entorno secret: jwtConstants.secret la cambiamos por  secret: process.env.JWT_SEED
        token, { secret: process.env.JWT_SEED }
      );
      console.log({ payload });
      //request['user'] = payload;
     
      //ponemos la id del usuario en el request
      //para enviarla al controller del metodo findAll() 
      //para obtener la informacion del usuario hacemos un metodo en el AuthService
      //con payload.id  nos regresa el usuario en el emetodo findUserById
      //request['user'] = payload.id;

      const user = await this.authService.findUserById(payload.id);
      if(!user) throw new UnauthorizedException('User does not exist');
      //if ( !user.isActive ) throw new UnauthorizedException('User is not active');

      // ponemos el usuario en el request
      request['user'] = user;



     } catch (error) {
      throw new UnauthorizedException ('No esta Autorizado');
    }
    return true;
    //return Promise.resolve(true);
  }

  //el token viene en los headers
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
