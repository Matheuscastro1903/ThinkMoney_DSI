```mermaid
    classDiagram
        class Usuario {
            -nome: String
            -email: String
            -username: String
            -data_nascimento: Date
            -renda: Number
            -telefone: Telefone
            -profissao: String
            -lembretes: Lembrete[]
            -metas: Meta[]
            -gastos: Gasto[]
            -listas_de_compras: ListaCompras[]
            -familia: Familia
            +verConta()
            +cadastrar()
            +atualizarConta()
            +excluirConta()
            +verLembretes()
            +verMetas()
            +verGastos()
        }
        class Endereco {
            
        }
        class Lembrete {
            -categoria: String
            -nome: String
            -valor: Number
            -vencimento: Date
            -status: String
            +adicionarLembrete()
            +atualizarLembrete()
            +verLembrete()
            +excluirLembrete()
        }
        class Meta {
            -data_limite: Date
            -nome: String
            -valor_poupado: Number
            -valor_total: Number
            -categoria: String
            -descricao: String
            -id_imagem: File
            +criarMeta()
            +editarMeta()
            +verMeta()
            +excluirMeta()
        }
        class Gasto {
            -nome: String
            -data: Date
            -fixo: Boolean
            -valor: Number
            -endereco: Endereco
            -descricao: String
            -categoria: String
            +criarGasto()
            +editarGasto()
            +verGasto()
            +excluirGasto()
        }
        class ListaCompras {
            -nome: String
            -tipo: String
            -itens: ItemListaCompras[]
            -descricao: String
            -data_compra: String
            -local_compra: String
            +criarListaDeCompras()
            +editarListaDeCompras()
            +verListaDeCompras()
            +excluirListaDeCompras()
        }
        class ItemListaCompras {
            -nome: String
            -quantidade: Number
            -valor_unitario: Number
            +criarItemListaDeCompras()
            +editarItemListaDeCompras()
            +verItemListaDeCompras()
            +excluirItemListaDeCompras()
        }
        class Familia {
            -nome: String
            -admin: Usuario
            -codigo_convite: String
            -membros: Usuario[]
            -metas: Meta[]
            -gastos: Gasto[]
            +verFamilia()
            +criarFamilia()
            +atualizarFamilia()
            +excluirFamilia()
            +removerMembro()
            +verNumeroMembros()
            +verNumeroMetasFamilia()
            +gerarCodigoFamilia()
        }
        Usuario "1" --> "*" Lembrete : possui
        Usuario "1" --> "*" Meta : possui
        Usuario "1" --> "*" Gastos : possui
        Usuario "1" --> "*" ListaCompras : possui
        ListaCompras "1" --> "*" ItemListaCompras: possui
        Usuario "1" --> "1" Familia : possui
        Familia "1" --> "*" Lembrete : possui
        Familia "1" --> "*" Meta : possui
        Familia "1" --> "*" Gasto : possui
        Familia "1" --> "*" Usuario: possui