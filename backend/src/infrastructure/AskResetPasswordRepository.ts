import { Pool } from "pg";

class AskResetPasswordRepository {
  constructor(private pool: Pool) {}

   async save (user_id:number, token:string, date_expiration:Date){
      await this.pool.query(
          `
          INSERT INTO reset_password(user_id,token,date_expiration)
            VALUE($1, $2, $3)
           `,
            [user_id, token, date_expiration]
      )
   }

   async find(token:string){
      const { rows } = await this.pool.query(

          `
          SELECT * FROM reset_password WHERE token = $1 
           `,
         [token]
      );

      return rows || null
   }

   async update(token : string,  status : boolean){
      await this.pool.query(
          `
          UPDATE reset_password SET status = 
          $1  WHERE token = $2
           `,
            [token,status]
      )
      
      
   }

}

export default AskResetPasswordRepository