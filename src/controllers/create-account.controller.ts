import { Body } from "@nestjs/common";
import { ConflictException } from "@nestjs/common";
import { Controller, HttpCode, Post } from "@nestjs/common"
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {

    const { name, password, email, birthDate } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (userWithSameEmail) {
      throw new ConflictException('E-mail já pertence a conta cadastrada')
    }

    const convertedBirthDate = this.convertToDate(birthDate)

    await this.prisma.user.create({
      data: {
        name,
        password,
        email,
        birthDate: convertedBirthDate
      }
    })


  }


  convertToDate(birthDateString: string): Date {
    // Dividir a string da data no formato "DD/MM/YYYY"
    const [day, month, year] = birthDateString.split('/');

    // Reordenar os componentes para o formato "YYYY-MM-DD" e criar o objeto Date
    const birthDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

    return birthDate;
  }
}
