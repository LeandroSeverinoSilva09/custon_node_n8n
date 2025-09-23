import {
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	NodeOperationError
} from 'n8n-workflow';


export class NumberRandom implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Random',
		name: 'numberRandom',
		icon: 'file:random.svg',
		group: ['transform'],
		version: 1,
		description: 'Nó que aleatoriza um número dentro de um intervalo, esse número é aleatorizado através de uma API',
		defaults: {
			name: 'Random',
			color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Min',
				name: 'Min',
				type: 'number',
				default: '',
				description: 'Digite o número mínimo para o intervalo',
				required: true,
			},
			{
				displayName: 'Max',
				name: 'Max',
				type: 'number',
				default: '',
				description: 'Digite o número máximo para o intervalo',
				required: true,
			}
		],
	};

    async execute(this: any): Promise<INodeExecutionData[][]> {

        const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const min = this.getNodeParameter('Min', i) as number;

				const max = this.getNodeParameter('Max', i) as number;

				const resposta = await fetch(`https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`, { method: 'GET' });

				if (!resposta.ok) {
					throw new Error(`Erro na requisição: ${resposta.status} - ${resposta.statusText}`);
				}

				const dadosText = await resposta.text();
                const dados = parseInt(dadosText, 10);

				returnData.push({
                    json: {
                        randomNumber: dados
                    }
                });
			} catch (error) {
				throw new NodeOperationError(this.getNode(), error as Error);
			}
		}

		return [returnData];
	}
}
