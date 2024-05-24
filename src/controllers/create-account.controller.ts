import { Body, UsePipes } from "@nestjs/common";
import { ConflictException } from "@nestjs/common";
import { Controller, HttpCode, Post } from "@nestjs/common"
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "src/pipe/zod-validation.pipe";
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from "zod"

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  birthDate: z.string()
})

type createAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: createAccountBodySchema) {

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
    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        password: hashedPassword,
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
