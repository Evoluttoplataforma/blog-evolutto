declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"4-ferramentas-para-escalar-processos-e-reduzir-custos-na-operacao-de-uma-consultoria-tradicional/index.md": {
	id: "4-ferramentas-para-escalar-processos-e-reduzir-custos-na-operacao-de-uma-consultoria-tradicional/index.md";
  slug: "4-ferramentas-para-escalar-processos-e-reduzir-custos-na-operacao-de-uma-consultoria-tradicional";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"7-motivos-para-fazer-parte-do-evolutto-digital-partners/index.md": {
	id: "7-motivos-para-fazer-parte-do-evolutto-digital-partners/index.md";
  slug: "7-motivos-para-fazer-parte-do-evolutto-digital-partners";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"a-desorganizacao-interna-de-consultorias-e-o-que-m4t4/index.md": {
	id: "a-desorganizacao-interna-de-consultorias-e-o-que-m4t4/index.md";
  slug: "a-desorganizacao-interna-de-consultorias-e-o-que-m4t4";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"a-evolucao-do-processo-de-implantacao-do-software/index.md": {
	id: "a-evolucao-do-processo-de-implantacao-do-software/index.md";
  slug: "a-evolucao-do-processo-de-implantacao-do-software";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"a-formula-do-crescimento-sem-limites/index.md": {
	id: "a-formula-do-crescimento-sem-limites/index.md";
  slug: "a-formula-do-crescimento-sem-limites";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"a-importancia-da-extracao-e-do-gerenciamento-de-dados-na-consultoria/index.md": {
	id: "a-importancia-da-extracao-e-do-gerenciamento-de-dados-na-consultoria/index.md";
  slug: "a-importancia-da-extracao-e-do-gerenciamento-de-dados-na-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"a-inteligencia-artificial-como-chave-para-a-produtividade-na-consultoria/index.md": {
	id: "a-inteligencia-artificial-como-chave-para-a-produtividade-na-consultoria/index.md";
  slug: "a-inteligencia-artificial-como-chave-para-a-produtividade-na-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"a-melhor-experiencia-que-o-seu-cliente-pode-ter-com-a-sua-consultoria/index.md": {
	id: "a-melhor-experiencia-que-o-seu-cliente-pode-ter-com-a-sua-consultoria/index.md";
  slug: "a-melhor-experiencia-que-o-seu-cliente-pode-ter-com-a-sua-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"a-rota-para-o-sucesso-na-consultoria-moderna/index.md": {
	id: "a-rota-para-o-sucesso-na-consultoria-moderna/index.md";
  slug: "a-rota-para-o-sucesso-na-consultoria-moderna";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"acelere-sua-consultoria-enquanto-ganha-tempo-e-qualidade-de-vida/index.md": {
	id: "acelere-sua-consultoria-enquanto-ganha-tempo-e-qualidade-de-vida/index.md";
  slug: "acelere-sua-consultoria-enquanto-ganha-tempo-e-qualidade-de-vida";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"acelere-sua-consultoria/index.md": {
	id: "acelere-sua-consultoria/index.md";
  slug: "acelere-sua-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"alcance-uma-boa-gestao-de-projetos-de-consultoria/index.md": {
	id: "alcance-uma-boa-gestao-de-projetos-de-consultoria/index.md";
  slug: "alcance-uma-boa-gestao-de-projetos-de-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"amplie-seu-portfolio-e-otimize-operacoes-sem-perder-a-produtividade/index.md": {
	id: "amplie-seu-portfolio-e-otimize-operacoes-sem-perder-a-produtividade/index.md";
  slug: "amplie-seu-portfolio-e-otimize-operacoes-sem-perder-a-produtividade";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"andragogia-e-a-produtizacao-da-consultoria/index.md": {
	id: "andragogia-e-a-produtizacao-da-consultoria/index.md";
  slug: "andragogia-e-a-produtizacao-da-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"anuncios-que-convertem-guia-completo-para-vender-mais/index.md": {
	id: "anuncios-que-convertem-guia-completo-para-vender-mais/index.md";
  slug: "anuncios-que-convertem-guia-completo-para-vender-mais";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"aprenda-a-atender-50-clientes-simultaneamente-2/index.md": {
	id: "aprenda-a-atender-50-clientes-simultaneamente-2/index.md";
  slug: "aprenda-a-atender-50-clientes-simultaneamente-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"aprenda-a-atender-50-clientes-simultaneamente/index.md": {
	id: "aprenda-a-atender-50-clientes-simultaneamente/index.md";
  slug: "aprenda-a-atender-50-clientes-simultaneamente";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"aquisicao-de-clientes-na-consultoria/index.md": {
	id: "aquisicao-de-clientes-na-consultoria/index.md";
  slug: "aquisicao-de-clientes-na-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"area-do-cliente-o-diferencial-estrategico-que-esta-revolucionando-a-experiencia-nas-consultorias/index.md": {
	id: "area-do-cliente-o-diferencial-estrategico-que-esta-revolucionando-a-experiencia-nas-consultorias/index.md";
  slug: "area-do-cliente-o-diferencial-estrategico-que-esta-revolucionando-a-experiencia-nas-consultorias";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"armadilhas-mentais-que-impedem-sua-consultoria-de-escalar/index.md": {
	id: "armadilhas-mentais-que-impedem-sua-consultoria-de-escalar/index.md";
  slug: "armadilhas-mentais-que-impedem-sua-consultoria-de-escalar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"as-3-perguntas-que-todo-consultor-precisa-responder-agora/index.md": {
	id: "as-3-perguntas-que-todo-consultor-precisa-responder-agora/index.md";
  slug: "as-3-perguntas-que-todo-consultor-precisa-responder-agora";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"assessoria-de-implantacao/index.md": {
	id: "assessoria-de-implantacao/index.md";
  slug: "assessoria-de-implantacao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"atenda-50-clientes-simultaneamente-trabalhando-menos-horas-por-dia-e-sem-enlouquecer/index.md": {
	id: "atenda-50-clientes-simultaneamente-trabalhando-menos-horas-por-dia-e-sem-enlouquecer/index.md";
  slug: "atenda-50-clientes-simultaneamente-trabalhando-menos-horas-por-dia-e-sem-enlouquecer";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"atenda-ate-50-clientes-simultaneamente-aumentando-sua-produtividade-sem-perder-qualidade/index.md": {
	id: "atenda-ate-50-clientes-simultaneamente-aumentando-sua-produtividade-sem-perder-qualidade/index.md";
  slug: "atenda-ate-50-clientes-simultaneamente-aumentando-sua-produtividade-sem-perder-qualidade";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"atenda-mais-clientes-e-aumente-seu-faturamento-sem-trabalhar-mais/index.md": {
	id: "atenda-mais-clientes-e-aumente-seu-faturamento-sem-trabalhar-mais/index.md";
  slug: "atenda-mais-clientes-e-aumente-seu-faturamento-sem-trabalhar-mais";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"auemente-seus-lucros-ganhando-qualidade-de-vida-e-sem-perder-tempo/index.md": {
	id: "auemente-seus-lucros-ganhando-qualidade-de-vida-e-sem-perder-tempo/index.md";
  slug: "auemente-seus-lucros-ganhando-qualidade-de-vida-e-sem-perder-tempo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"aumente-o-roi-da-sua-consultoria-sem-trabalhar-mais-o-metodo-que-garante-crescimento-lucrativo/index.md": {
	id: "aumente-o-roi-da-sua-consultoria-sem-trabalhar-mais-o-metodo-que-garante-crescimento-lucrativo/index.md";
  slug: "aumente-o-roi-da-sua-consultoria-sem-trabalhar-mais-o-metodo-que-garante-crescimento-lucrativo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"aumente-seus-lucros-na-consultoria-sem-depender-de-horas-extras-ou-projetos-estressantes/index.md": {
	id: "aumente-seus-lucros-na-consultoria-sem-depender-de-horas-extras-ou-projetos-estressantes/index.md";
  slug: "aumente-seus-lucros-na-consultoria-sem-depender-de-horas-extras-ou-projetos-estressantes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"automacao-de-negocios-com-ia/index.md": {
	id: "automacao-de-negocios-com-ia/index.md";
  slug: "automacao-de-negocios-com-ia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"automacao-de-onboarding-para-consultores/index.md": {
	id: "automacao-de-onboarding-para-consultores/index.md";
  slug: "automacao-de-onboarding-para-consultores";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"automatize-suas-vendas-e-ganhe-mais-tempo-sem-perder-a-personalizacao/index.md": {
	id: "automatize-suas-vendas-e-ganhe-mais-tempo-sem-perder-a-personalizacao/index.md";
  slug: "automatize-suas-vendas-e-ganhe-mais-tempo-sem-perder-a-personalizacao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"blog/index.md": {
	id: "blog/index.md";
  slug: "blog";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"calculadora-de-roi-para-consultorias/index.md": {
	id: "calculadora-de-roi-para-consultorias/index.md";
  slug: "calculadora-de-roi-para-consultorias";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"case-de-sucesso-bem-te-quero-60/index.md": {
	id: "case-de-sucesso-bem-te-quero-60/index.md";
  slug: "case-de-sucesso-bem-te-quero-60";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-a-automacao-operacional-dos-processos-consultivos-vai-ajudar-na-eficiencia-da-sua-empresa/index.md": {
	id: "como-a-automacao-operacional-dos-processos-consultivos-vai-ajudar-na-eficiencia-da-sua-empresa/index.md";
  slug: "como-a-automacao-operacional-dos-processos-consultivos-vai-ajudar-na-eficiencia-da-sua-empresa";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-a-weagle-consultoria-superou-em-mais-de-1000-seu-faturamento-utilizando-a-solucao-do-evolutto/index.md": {
	id: "como-a-weagle-consultoria-superou-em-mais-de-1000-seu-faturamento-utilizando-a-solucao-do-evolutto/index.md";
  slug: "como-a-weagle-consultoria-superou-em-mais-de-1000-seu-faturamento-utilizando-a-solucao-do-evolutto";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-alcancar-um-posicionamento-estrategico-poderoso-sem-perder-sua-essencia-ou-tempo-precioso/index.md": {
	id: "como-alcancar-um-posicionamento-estrategico-poderoso-sem-perder-sua-essencia-ou-tempo-precioso/index.md";
  slug: "como-alcancar-um-posicionamento-estrategico-poderoso-sem-perder-sua-essencia-ou-tempo-precioso";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-atrair-mais-clientes-qualificados-e-aumentar-a-retencao-sem-sacrificar-seu-tempo-ou-lucro/index.md": {
	id: "como-atrair-mais-clientes-qualificados-e-aumentar-a-retencao-sem-sacrificar-seu-tempo-ou-lucro/index.md";
  slug: "como-atrair-mais-clientes-qualificados-e-aumentar-a-retencao-sem-sacrificar-seu-tempo-ou-lucro";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-atrair-o-cliente-certo-para-sua-consultoria/index.md": {
	id: "como-atrair-o-cliente-certo-para-sua-consultoria/index.md";
  slug: "como-atrair-o-cliente-certo-para-sua-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-chamar-a-atencao-em-um-mundo-cheio-de-distracoes/index.md": {
	id: "como-chamar-a-atencao-em-um-mundo-cheio-de-distracoes/index.md";
  slug: "como-chamar-a-atencao-em-um-mundo-cheio-de-distracoes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-cobrar-uma-consultoria/index.md": {
	id: "como-cobrar-uma-consultoria/index.md";
  slug: "como-cobrar-uma-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-consultoria-escalavel-gerenciam-projetos-eliminando-tarefas/index.md": {
	id: "como-consultoria-escalavel-gerenciam-projetos-eliminando-tarefas/index.md";
  slug: "como-consultoria-escalavel-gerenciam-projetos-eliminando-tarefas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-criar-ofertas-tao-furiosas-que-seus-clientes-se-sentirao-idiotas-em-dizer-nao/index.md": {
	id: "como-criar-ofertas-tao-furiosas-que-seus-clientes-se-sentirao-idiotas-em-dizer-nao/index.md";
  slug: "como-criar-ofertas-tao-furiosas-que-seus-clientes-se-sentirao-idiotas-em-dizer-nao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-escalar-consultoria-guia-completo/index.md": {
	id: "como-escalar-consultoria-guia-completo/index.md";
  slug: "como-escalar-consultoria-guia-completo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-escalar-sua-empresa-de-consultoria/index.md": {
	id: "como-escalar-sua-empresa-de-consultoria/index.md";
  slug: "como-escalar-sua-empresa-de-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-escapar-da-armadilha-do-tempo-e-acelerar-o-crescimento-da-sua-consultoria-sem-sacrificar-sua-qualidade-de-vida/index.md": {
	id: "como-escapar-da-armadilha-do-tempo-e-acelerar-o-crescimento-da-sua-consultoria-sem-sacrificar-sua-qualidade-de-vida/index.md";
  slug: "como-escapar-da-armadilha-do-tempo-e-acelerar-o-crescimento-da-sua-consultoria-sem-sacrificar-sua-qualidade-de-vida";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-escolher-o-nicho-ideal-para-sua-consultoria-e-atrair-mais-clientes-sem-perder-tempo-ou-dinheiro/index.md": {
	id: "como-escolher-o-nicho-ideal-para-sua-consultoria-e-atrair-mais-clientes-sem-perder-tempo-ou-dinheiro/index.md";
  slug: "como-escolher-o-nicho-ideal-para-sua-consultoria-e-atrair-mais-clientes-sem-perder-tempo-ou-dinheiro";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-fazer-precificacao-de-consultoria-de-forma-estrategica/index.md": {
	id: "como-fazer-precificacao-de-consultoria-de-forma-estrategica/index.md";
  slug: "como-fazer-precificacao-de-consultoria-de-forma-estrategica";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-ganhar-da-concorrencia-estrategias-para-consultorias-e-mentorias/index.md": {
	id: "como-ganhar-da-concorrencia-estrategias-para-consultorias-e-mentorias/index.md";
  slug: "como-ganhar-da-concorrencia-estrategias-para-consultorias-e-mentorias";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-identificar-seu-cliente-ideal-um-guia-definitivo/index.md": {
	id: "como-identificar-seu-cliente-ideal-um-guia-definitivo/index.md";
  slug: "como-identificar-seu-cliente-ideal-um-guia-definitivo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-monetizar-e-expandir-sua-consultoria-ganhando-praticidade-sem-perder-tempo-precioso/index.md": {
	id: "como-monetizar-e-expandir-sua-consultoria-ganhando-praticidade-sem-perder-tempo-precioso/index.md";
  slug: "como-monetizar-e-expandir-sua-consultoria-ganhando-praticidade-sem-perder-tempo-precioso";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-multiplicar-resultados-e-escalar-sua-consultoria-sem-abrir-mao-da-personalizacao-ou-da-qualidade/index.md": {
	id: "como-multiplicar-resultados-e-escalar-sua-consultoria-sem-abrir-mao-da-personalizacao-ou-da-qualidade/index.md";
  slug: "como-multiplicar-resultados-e-escalar-sua-consultoria-sem-abrir-mao-da-personalizacao-ou-da-qualidade";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-planejar-uma-estrategia-de-marketing-digital-assertiva-para-a-minha-consultoria-digital/index.md": {
	id: "como-planejar-uma-estrategia-de-marketing-digital-assertiva-para-a-minha-consultoria-digital/index.md";
  slug: "como-planejar-uma-estrategia-de-marketing-digital-assertiva-para-a-minha-consultoria-digital";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-produtizar-consultoria/index.md": {
	id: "como-produtizar-consultoria/index.md";
  slug: "como-produtizar-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-vender-consultoria-5-segredos-revelados/index.md": {
	id: "como-vender-consultoria-5-segredos-revelados/index.md";
  slug: "como-vender-consultoria-5-segredos-revelados";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"como-vender-sua-consultoria-como-um-produto-escalavel-sem-concorrer-por-preco/index.md": {
	id: "como-vender-sua-consultoria-como-um-produto-escalavel-sem-concorrer-por-preco/index.md";
  slug: "como-vender-sua-consultoria-como-um-produto-escalavel-sem-concorrer-por-preco";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"comunicacao-na-consultoria-quanto-menos-o-cliente-falar-com-voce-melhor-pra-ele/index.md": {
	id: "comunicacao-na-consultoria-quanto-menos-o-cliente-falar-com-voce-melhor-pra-ele/index.md";
  slug: "comunicacao-na-consultoria-quanto-menos-o-cliente-falar-com-voce-melhor-pra-ele";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultoria-com-ia-como-aplicar-e-escalar-seus-servicos/index.md": {
	id: "consultoria-com-ia-como-aplicar-e-escalar-seus-servicos/index.md";
  slug: "consultoria-com-ia-como-aplicar-e-escalar-seus-servicos";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultoria-digital-como-evitar-as-ciladas-que-aprisionam-no-modelo-analogico/index.md": {
	id: "consultoria-digital-como-evitar-as-ciladas-que-aprisionam-no-modelo-analogico/index.md";
  slug: "consultoria-digital-como-evitar-as-ciladas-que-aprisionam-no-modelo-analogico";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultoria-digital-por-que-e-tao-dificil-vender-neste-modelo/index.md": {
	id: "consultoria-digital-por-que-e-tao-dificil-vender-neste-modelo/index.md";
  slug: "consultoria-digital-por-que-e-tao-dificil-vender-neste-modelo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultoria-digital-por-que-investir-na-assessoria-de-implantacao-do-evolutto/index.md": {
	id: "consultoria-digital-por-que-investir-na-assessoria-de-implantacao-do-evolutto/index.md";
  slug: "consultoria-digital-por-que-investir-na-assessoria-de-implantacao-do-evolutto";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultoria-escalavel-guia-para-um-crescimento-sustentavel/index.md": {
	id: "consultoria-escalavel-guia-para-um-crescimento-sustentavel/index.md";
  slug: "consultoria-escalavel-guia-para-um-crescimento-sustentavel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultoria-hibrida-case-implantta-consultoria/index.md": {
	id: "consultoria-hibrida-case-implantta-consultoria/index.md";
  slug: "consultoria-hibrida-case-implantta-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultoria-hibrida-entenda-como-funciona-esse-servico/index.md": {
	id: "consultoria-hibrida-entenda-como-funciona-esse-servico/index.md";
  slug: "consultoria-hibrida-entenda-como-funciona-esse-servico";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultoria-online-e-hibrida-quais-as-diferencas/index.md": {
	id: "consultoria-online-e-hibrida-quais-as-diferencas/index.md";
  slug: "consultoria-online-e-hibrida-quais-as-diferencas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultoria-online-por-onde-comecar/index.md": {
	id: "consultoria-online-por-onde-comecar/index.md";
  slug: "consultoria-online-por-onde-comecar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultoria-sem-caos-como-organizar-sua-operacao-e-multiplicar-resultados-sem-precisar-aumentar-a-equipe/index.md": {
	id: "consultoria-sem-caos-como-organizar-sua-operacao-e-multiplicar-resultados-sem-precisar-aumentar-a-equipe/index.md";
  slug: "consultoria-sem-caos-como-organizar-sua-operacao-e-multiplicar-resultados-sem-precisar-aumentar-a-equipe";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"consultorias-estrategias-de-crescimento-e-escala/index.md": {
	id: "consultorias-estrategias-de-crescimento-e-escala/index.md";
  slug: "consultorias-estrategias-de-crescimento-e-escala";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"contador-por-que-empresas-de-consultoria-precisam-desse-profissional/index.md": {
	id: "contador-por-que-empresas-de-consultoria-precisam-desse-profissional/index.md";
  slug: "contador-por-que-empresas-de-consultoria-precisam-desse-profissional";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"cresca-sua-consultoria-ganhando-mais-clientes-sem-perder-sua-liberdade/index.md": {
	id: "cresca-sua-consultoria-ganhando-mais-clientes-sem-perder-sua-liberdade/index.md";
  slug: "cresca-sua-consultoria-ganhando-mais-clientes-sem-perder-sua-liberdade";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"ctps-digital-veja-o-que-mudou/index.md": {
	id: "ctps-digital-veja-o-que-mudou/index.md";
  slug: "ctps-digital-veja-o-que-mudou";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"curso-para-consultores-o-metodo-comprovado/index.md": {
	id: "curso-para-consultores-o-metodo-comprovado/index.md";
  slug: "curso-para-consultores-o-metodo-comprovado";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"data-usage-policy-for-evolutto-google-calendar-integration/index.md": {
	id: "data-usage-policy-for-evolutto-google-calendar-integration/index.md";
  slug: "data-usage-policy-for-evolutto-google-calendar-integration";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"deep-dive-segundo-mergulho/index.md": {
	id: "deep-dive-segundo-mergulho/index.md";
  slug: "deep-dive-segundo-mergulho";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"demonstracao-da-plataforma-global-de-consultoria/index.md": {
	id: "demonstracao-da-plataforma-global-de-consultoria/index.md";
  slug: "demonstracao-da-plataforma-global-de-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"descubra-quanto-cobrar-por-sua-consultoria/index.md": {
	id: "descubra-quanto-cobrar-por-sua-consultoria/index.md";
  slug: "descubra-quanto-cobrar-por-sua-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"digitalizacao-de-consultoria-comece-pela-mente/index.md": {
	id: "digitalizacao-de-consultoria-comece-pela-mente/index.md";
  slug: "digitalizacao-de-consultoria-comece-pela-mente";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"digitalizacao-de-consultoria/index.md": {
	id: "digitalizacao-de-consultoria/index.md";
  slug: "digitalizacao-de-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"diminuir-os-custos-de-consultoria-confira-os-4-primeiros-passos/index.md": {
	id: "diminuir-os-custos-de-consultoria-confira-os-4-primeiros-passos/index.md";
  slug: "diminuir-os-custos-de-consultoria-confira-os-4-primeiros-passos";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"do-consultor-escravo-ao-empreendedor-lucrativo-a-revolucao-do-modelo-de-negocio/index.md": {
	id: "do-consultor-escravo-ao-empreendedor-lucrativo-a-revolucao-do-modelo-de-negocio/index.md";
  slug: "do-consultor-escravo-ao-empreendedor-lucrativo-a-revolucao-do-modelo-de-negocio";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"download-diagnostico/index.md": {
	id: "download-diagnostico/index.md";
  slug: "download-diagnostico";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"download-kit-produtizacao-estruturacao-consultoria-digital/index.md": {
	id: "download-kit-produtizacao-estruturacao-consultoria-digital/index.md";
  slug: "download-kit-produtizacao-estruturacao-consultoria-digital";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"download-quanto-cobrar-por-uma-consultoria-digital/index.md": {
	id: "download-quanto-cobrar-por-uma-consultoria-digital/index.md";
  slug: "download-quanto-cobrar-por-uma-consultoria-digital";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"ebook-6ds-crescimento-exponencial/index.md": {
	id: "ebook-6ds-crescimento-exponencial/index.md";
  slug: "ebook-6ds-crescimento-exponencial";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"empresa-de-consultoria/index.md": {
	id: "empresa-de-consultoria/index.md";
  slug: "empresa-de-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"erp-software/index.md": {
	id: "erp-software/index.md";
  slug: "erp-software";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"escalar-consultoria-como-crescer-sem-vender-horas/index.md": {
	id: "escalar-consultoria-como-crescer-sem-vender-horas/index.md";
  slug: "escalar-consultoria-como-crescer-sem-vender-horas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"estrategias-precificacao-lucratividade-consultoria/index.md": {
	id: "estrategias-precificacao-lucratividade-consultoria/index.md";
  slug: "estrategias-precificacao-lucratividade-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"evolutto-mobile-b/index.md": {
	id: "evolutto-mobile-b/index.md";
  slug: "evolutto-mobile-b";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"evolutto-mobile/index.md": {
	id: "evolutto-mobile/index.md";
  slug: "evolutto-mobile";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"evolutto-tv/index.md": {
	id: "evolutto-tv/index.md";
  slug: "evolutto-tv";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"evolutto-vs-bitrix24-veja-o-porque-o-evolutto-e-a-melhor-solucao-para-sua-consultoria/index.md": {
	id: "evolutto-vs-bitrix24-veja-o-porque-o-evolutto-e-a-melhor-solucao-para-sua-consultoria/index.md";
  slug: "evolutto-vs-bitrix24-veja-o-porque-o-evolutto-e-a-melhor-solucao-para-sua-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"faca-um-diagnostico-estrategico-preciso-sem-perder-tempo-ou-complicar-a-gestao/index.md": {
	id: "faca-um-diagnostico-estrategico-preciso-sem-perder-tempo-ou-complicar-a-gestao/index.md";
  slug: "faca-um-diagnostico-estrategico-preciso-sem-perder-tempo-ou-complicar-a-gestao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"falar-com-a-gente-antiga/index.md": {
	id: "falar-com-a-gente-antiga/index.md";
  slug: "falar-com-a-gente-antiga";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"falar-com-a-gente/index.md": {
	id: "falar-com-a-gente/index.md";
  slug: "falar-com-a-gente";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"features/index.md": {
	id: "features/index.md";
  slug: "features";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"ferramentasebrae/index.md": {
	id: "ferramentasebrae/index.md";
  slug: "ferramentasebrae";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"funil-de-vendas-na-consultoria/index.md": {
	id: "funil-de-vendas-na-consultoria/index.md";
  slug: "funil-de-vendas-na-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"gestao-de-consultoria-digital-o-guia-completo-para-escalar-e-organizar-resultados/index.md": {
	id: "gestao-de-consultoria-digital-o-guia-completo-para-escalar-e-organizar-resultados/index.md";
  slug: "gestao-de-consultoria-digital-o-guia-completo-para-escalar-e-organizar-resultados";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"gestao-de-dados-para-consultorias-como-o-evolutto-substitui-power-bi-e-tableau-com-dashboards-inteligentes-e-integrados/index.md": {
	id: "gestao-de-dados-para-consultorias-como-o-evolutto-substitui-power-bi-e-tableau-com-dashboards-inteligentes-e-integrados/index.md";
  slug: "gestao-de-dados-para-consultorias-como-o-evolutto-substitui-power-bi-e-tableau-com-dashboards-inteligentes-e-integrados";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"gestao-de-projetos-em-consultoria-digital/index.md": {
	id: "gestao-de-projetos-em-consultoria-digital/index.md";
  slug: "gestao-de-projetos-em-consultoria-digital";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"gestao-de-tarefas-em-consultorias-como-o-evolutto-substitui-trello-asana-e-notion-com-uma-visao-integrada-e-estrategica/index.md": {
	id: "gestao-de-tarefas-em-consultorias-como-o-evolutto-substitui-trello-asana-e-notion-com-uma-visao-integrada-e-estrategica/index.md";
  slug: "gestao-de-tarefas-em-consultorias-como-o-evolutto-substitui-trello-asana-e-notion-com-uma-visao-integrada-e-estrategica";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"grandes-contas/index.md": {
	id: "grandes-contas/index.md";
  slug: "grandes-contas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"home-v1/index.md": {
	id: "home-v1/index.md";
  slug: "home-v1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"homepage/index.md": {
	id: "homepage/index.md";
  slug: "homepage";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"ia-para-consultorias-como-a-ia-do-evolutto-substitui-o-chatgpt-na-criacao-de-projetos-escalaveis-e-personalizados/index.md": {
	id: "ia-para-consultorias-como-a-ia-do-evolutto-substitui-o-chatgpt-na-criacao-de-projetos-escalaveis-e-personalizados/index.md";
  slug: "ia-para-consultorias-como-a-ia-do-evolutto-substitui-o-chatgpt-na-criacao-de-projetos-escalaveis-e-personalizados";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"ia-para-reunioes-como-a-inteligencia-artificial-esta-mudando-a-forma-de-conduzir-e-registrar-reunioes-profissionais/index.md": {
	id: "ia-para-reunioes-como-a-inteligencia-artificial-esta-mudando-a-forma-de-conduzir-e-registrar-reunioes-profissionais/index.md";
  slug: "ia-para-reunioes-como-a-inteligencia-artificial-esta-mudando-a-forma-de-conduzir-e-registrar-reunioes-profissionais";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"implantacao-de-software-como-escalar-com-eficiencia-e-controle/index.md": {
	id: "implantacao-de-software-como-escalar-com-eficiencia-e-controle/index.md";
  slug: "implantacao-de-software-como-escalar-com-eficiencia-e-controle";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"implantacao-de-software-escalavel/index.md": {
	id: "implantacao-de-software-escalavel/index.md";
  slug: "implantacao-de-software-escalavel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"implantacao-de-software/index.md": {
	id: "implantacao-de-software/index.md";
  slug: "implantacao-de-software";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"indicacao/index.md": {
	id: "indicacao/index.md";
  slug: "indicacao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"indicacaofinalareaindicacao/index.md": {
	id: "indicacaofinalareaindicacao/index.md";
  slug: "indicacaofinalareaindicacao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"infografico-construa-sua-autoridade/index.md": {
	id: "infografico-construa-sua-autoridade/index.md";
  slug: "infografico-construa-sua-autoridade";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"instagram-organico-guia-essencial-para-consultores/index.md": {
	id: "instagram-organico-guia-essencial-para-consultores/index.md";
  slug: "instagram-organico-guia-essencial-para-consultores";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"integracao-da-comunicacao-em-consultorias-por-que-centralizar-tudo-em-uma-so-plataforma-faz-a-diferenca/index.md": {
	id: "integracao-da-comunicacao-em-consultorias-por-que-centralizar-tudo-em-uma-so-plataforma-faz-a-diferenca/index.md";
  slug: "integracao-da-comunicacao-em-consultorias-por-que-centralizar-tudo-em-uma-so-plataforma-faz-a-diferenca";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"landing-page-para-consultores-como-criar-uma-que-converte/index.md": {
	id: "landing-page-para-consultores-como-criar-uma-que-converte/index.md";
  slug: "landing-page-para-consultores-como-criar-uma-que-converte";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"libere-sua-agenda-aumentando-em-5x-a-sua-produtividade-sem-sacrificar-a-sua-familia/index.md": {
	id: "libere-sua-agenda-aumentando-em-5x-a-sua-produtividade-sem-sacrificar-a-sua-familia/index.md";
  slug: "libere-sua-agenda-aumentando-em-5x-a-sua-produtividade-sem-sacrificar-a-sua-familia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"lp-produto/index.md": {
	id: "lp-produto/index.md";
  slug: "lp-produto";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"manual-para-lidar-com-clientes-desengajados/index.md": {
	id: "manual-para-lidar-com-clientes-desengajados/index.md";
  slug: "manual-para-lidar-com-clientes-desengajados";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"marketing-de-indicacao-para-negocios-digitais/index.md": {
	id: "marketing-de-indicacao-para-negocios-digitais/index.md";
  slug: "marketing-de-indicacao-para-negocios-digitais";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"marketing-digital-para-consultoria-confira-dicas-valiosas/index.md": {
	id: "marketing-digital-para-consultoria-confira-dicas-valiosas/index.md";
  slug: "marketing-digital-para-consultoria-confira-dicas-valiosas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"marketing-e-vendas-para-consultoria/index.md": {
	id: "marketing-e-vendas-para-consultoria/index.md";
  slug: "marketing-e-vendas-para-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"marketing-estrategico-seja-autoridade-no-digital/index.md": {
	id: "marketing-estrategico-seja-autoridade-no-digital/index.md";
  slug: "marketing-estrategico-seja-autoridade-no-digital";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"marketplace-evolutto-atracao-de-leads-para-nossas-consultorias/index.md": {
	id: "marketplace-evolutto-atracao-de-leads-para-nossas-consultorias/index.md";
  slug: "marketplace-evolutto-atracao-de-leads-para-nossas-consultorias";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"materialdeepdive/index.md": {
	id: "materialdeepdive/index.md";
  slug: "materialdeepdive";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"meetup/index.md": {
	id: "meetup/index.md";
  slug: "meetup";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"melhor-plataforma-para-consultoria-digital/index.md": {
	id: "melhor-plataforma-para-consultoria-digital/index.md";
  slug: "melhor-plataforma-para-consultoria-digital";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"melhor-solucao-para-consultorias/index.md": {
	id: "melhor-solucao-para-consultorias/index.md";
  slug: "melhor-solucao-para-consultorias";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"mentoria-v2/index.md": {
	id: "mentoria-v2/index.md";
  slug: "mentoria-v2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"mentorias/index.md": {
	id: "mentorias/index.md";
  slug: "mentorias";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"mentorship-dicas-para-conduzir-mentorias-curtas/index.md": {
	id: "mentorship-dicas-para-conduzir-mentorias-curtas/index.md";
  slug: "mentorship-dicas-para-conduzir-mentorias-curtas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"micro-solucao-com-ia-escale-sua-consultoria-hoje/index.md": {
	id: "micro-solucao-com-ia-escale-sua-consultoria-hoje/index.md";
  slug: "micro-solucao-com-ia-escale-sua-consultoria-hoje";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"minset-crescimento-disrupcao/index.md": {
	id: "minset-crescimento-disrupcao/index.md";
  slug: "minset-crescimento-disrupcao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"modelo-de-consultoria-afinal-qual-o-melhor/index.md": {
	id: "modelo-de-consultoria-afinal-qual-o-melhor/index.md";
  slug: "modelo-de-consultoria-afinal-qual-o-melhor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"modelo-de-negocio-para-consultoria-como-inovar-e-crescer/index.md": {
	id: "modelo-de-negocio-para-consultoria-como-inovar-e-crescer/index.md";
  slug: "modelo-de-negocio-para-consultoria-como-inovar-e-crescer";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"modelo-mental-da-consultoria-hibrida-entenda-como-ele-funciona/index.md": {
	id: "modelo-mental-da-consultoria-hibrida-entenda-como-ele-funciona/index.md";
  slug: "modelo-mental-da-consultoria-hibrida-entenda-como-ele-funciona";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"muito-obrigado-live/index.md": {
	id: "muito-obrigado-live/index.md";
  slug: "muito-obrigado-live";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"muito_obrigado/index.md": {
	id: "muito_obrigado/index.md";
  slug: "muito_obrigado";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"muito_obrigado_imersao/index.md": {
	id: "muito_obrigado_imersao/index.md";
  slug: "muito_obrigado_imersao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"muito_obrigado_whatsapp/index.md": {
	id: "muito_obrigado_whatsapp/index.md";
  slug: "muito_obrigado_whatsapp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"multiplique-suas-vendas-consultivas-sem-perder-tempo-em-reunioes-improdutivas/index.md": {
	id: "multiplique-suas-vendas-consultivas-sem-perder-tempo-em-reunioes-improdutivas/index.md";
  slug: "multiplique-suas-vendas-consultivas-sem-perder-tempo-em-reunioes-improdutivas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"news-evolutto-fevereiro-2023/index.md": {
	id: "news-evolutto-fevereiro-2023/index.md";
  slug: "news-evolutto-fevereiro-2023";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"news-evolutto-janeiro-2023/index.md": {
	id: "news-evolutto-janeiro-2023/index.md";
  slug: "news-evolutto-janeiro-2023";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"news-evolutto-julho-2022/index.md": {
	id: "news-evolutto-julho-2022/index.md";
  slug: "news-evolutto-julho-2022";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"news-evolutto-julho-2023/index.md": {
	id: "news-evolutto-julho-2023/index.md";
  slug: "news-evolutto-julho-2023";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"news-evolutto-maio-2023/index.md": {
	id: "news-evolutto-maio-2023/index.md";
  slug: "news-evolutto-maio-2023";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"news-evolutto-novembro-2023/index.md": {
	id: "news-evolutto-novembro-2023/index.md";
  slug: "news-evolutto-novembro-2023";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"newsletter/index.md": {
	id: "newsletter/index.md";
  slug: "newsletter";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"o-codigo-secreto-das-vendas-de-alto-valor/index.md": {
	id: "o-codigo-secreto-das-vendas-de-alto-valor/index.md";
  slug: "o-codigo-secreto-das-vendas-de-alto-valor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"o-erro-silenacioso-que-pode-estar-travando-suas-vendas/index.md": {
	id: "o-erro-silenacioso-que-pode-estar-travando-suas-vendas/index.md";
  slug: "o-erro-silenacioso-que-pode-estar-travando-suas-vendas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"o-guia-definitivo-para-consultores-ambiciosos-como-transformar-o-lucro-da-sua-empresa/index.md": {
	id: "o-guia-definitivo-para-consultores-ambiciosos-como-transformar-o-lucro-da-sua-empresa/index.md";
  slug: "o-guia-definitivo-para-consultores-ambiciosos-como-transformar-o-lucro-da-sua-empresa";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"o-novo-jogo-da-consultoria-como-escalar-sem-se-afogar-na-operacao/index.md": {
	id: "o-novo-jogo-da-consultoria-como-escalar-sem-se-afogar-na-operacao/index.md";
  slug: "o-novo-jogo-da-consultoria-como-escalar-sem-se-afogar-na-operacao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"o-que-a-experiencia-do-usuario-tem-a-ver-com-consultoria-online/index.md": {
	id: "o-que-a-experiencia-do-usuario-tem-a-ver-com-consultoria-online/index.md";
  slug: "o-que-a-experiencia-do-usuario-tem-a-ver-com-consultoria-online";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"o-que-e-a-nova-economia/index.md": {
	id: "o-que-e-a-nova-economia/index.md";
  slug: "o-que-e-a-nova-economia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"o-que-e-andragogia-e-o-que-ela-tem-a-ver-com-consultoria-online/index.md": {
	id: "o-que-e-andragogia-e-o-que-ela-tem-a-ver-com-consultoria-online/index.md";
  slug: "o-que-e-andragogia-e-o-que-ela-tem-a-ver-com-consultoria-online";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"o-que-o-bom-humor-tem-a-ver-com-negocios-e-saude-guest-post/index.md": {
	id: "o-que-o-bom-humor-tem-a-ver-com-negocios-e-saude-guest-post/index.md";
  slug: "o-que-o-bom-humor-tem-a-ver-com-negocios-e-saude-guest-post";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"obrigado-consultoria-evento2/index.md": {
	id: "obrigado-consultoria-evento2/index.md";
  slug: "obrigado-consultoria-evento2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"obrigado-erp-evento-2/index.md": {
	id: "obrigado-erp-evento-2/index.md";
  slug: "obrigado-erp-evento-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"obrigado-erp-evento/index.md": {
	id: "obrigado-erp-evento/index.md";
  slug: "obrigado-erp-evento";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"obrigado-erp/index.md": {
	id: "obrigado-erp/index.md";
  slug: "obrigado-erp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"obrigado-light/index.md": {
	id: "obrigado-light/index.md";
  slug: "obrigado-light";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"obrigado-live/index.md": {
	id: "obrigado-live/index.md";
  slug: "obrigado-live";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"obrigado-mentoria-evolutto/index.md": {
	id: "obrigado-mentoria-evolutto/index.md";
  slug: "obrigado-mentoria-evolutto";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"obrigado-mentoria/index.md": {
	id: "obrigado-mentoria/index.md";
  slug: "obrigado-mentoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"os-3-paradigmas-que-impedem-o-consultor-de-crescer-exponencialmente/index.md": {
	id: "os-3-paradigmas-que-impedem-o-consultor-de-crescer-exponencialmente/index.md";
  slug: "os-3-paradigmas-que-impedem-o-consultor-de-crescer-exponencialmente";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"os-5-maiores-desafios-da-consultoria-tradicional-e-como-a-digitalizacao-resolve-todos-eles/index.md": {
	id: "os-5-maiores-desafios-da-consultoria-tradicional-e-como-a-digitalizacao-resolve-todos-eles/index.md";
  slug: "os-5-maiores-desafios-da-consultoria-tradicional-e-como-a-digitalizacao-resolve-todos-eles";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"os-segredos-ocultos-sobre-a-gestao-de-consultores-nas-empresas-de-consultoria-mais-tradicionais/index.md": {
	id: "os-segredos-ocultos-sobre-a-gestao-de-consultores-nas-empresas-de-consultoria-mais-tradicionais/index.md";
  slug: "os-segredos-ocultos-sobre-a-gestao-de-consultores-nas-empresas-de-consultoria-mais-tradicionais";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"passo-a-passo-para-escalar-consultoria/index.md": {
	id: "passo-a-passo-para-escalar-consultoria/index.md";
  slug: "passo-a-passo-para-escalar-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"personalize-o-seu-atendimento-ao-cliente-e-escale-a-sua-consultoria/index.md": {
	id: "personalize-o-seu-atendimento-ao-cliente-e-escale-a-sua-consultoria/index.md";
  slug: "personalize-o-seu-atendimento-ao-cliente-e-escale-a-sua-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"personalize-sua-consultoria-e-atenda-mais-clientes-sem-abrir-mao-da-qualidade/index.md": {
	id: "personalize-sua-consultoria-e-atenda-mais-clientes-sem-abrir-mao-da-qualidade/index.md";
  slug: "personalize-sua-consultoria-e-atenda-mais-clientes-sem-abrir-mao-da-qualidade";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pitch-de-vendas-para-consultorias/index.md": {
	id: "pitch-de-vendas-para-consultorias/index.md";
  slug: "pitch-de-vendas-para-consultorias";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"planejamento-consultorias-2024/index.md": {
	id: "planejamento-consultorias-2024/index.md";
  slug: "planejamento-consultorias-2024";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"planeje-o-sucesso-da-sua-empresa-para-2025-sem-complicar-seus-processos/index.md": {
	id: "planeje-o-sucesso-da-sua-empresa-para-2025-sem-complicar-seus-processos/index.md";
  slug: "planeje-o-sucesso-da-sua-empresa-para-2025-sem-complicar-seus-processos";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"plataforma-de-projeto-premiada-pela-onu/index.md": {
	id: "plataforma-de-projeto-premiada-pela-onu/index.md";
  slug: "plataforma-de-projeto-premiada-pela-onu";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"plataforma-para-consultores/index.md": {
	id: "plataforma-para-consultores/index.md";
  slug: "plataforma-para-consultores";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"plataforma-para-consultoria-online/index.md": {
	id: "plataforma-para-consultoria-online/index.md";
  slug: "plataforma-para-consultoria-online";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"politica-de-privacidade-e-seguranca-de-dados/index.md": {
	id: "politica-de-privacidade-e-seguranca-de-dados/index.md";
  slug: "politica-de-privacidade-e-seguranca-de-dados";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"por-que-contratar-uma-tecnologia-e-digitalizar-seu-negocio/index.md": {
	id: "por-que-contratar-uma-tecnologia-e-digitalizar-seu-negocio/index.md";
  slug: "por-que-contratar-uma-tecnologia-e-digitalizar-seu-negocio";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"posicionamento-consultoria-digital/index.md": {
	id: "posicionamento-consultoria-digital/index.md";
  slug: "posicionamento-consultoria-digital";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"precificacao-de-consultoria-como-definir-o-valor-do-seu-servico/index.md": {
	id: "precificacao-de-consultoria-como-definir-o-valor-do-seu-servico/index.md";
  slug: "precificacao-de-consultoria-como-definir-o-valor-do-seu-servico";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"programa-deep-dive-2a-edicao/index.md": {
	id: "programa-deep-dive-2a-edicao/index.md";
  slug: "programa-deep-dive-2a-edicao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"programa-deep-dive-transformando-consultorias-em-potencias-do-mercado/index.md": {
	id: "programa-deep-dive-transformando-consultorias-em-potencias-do-mercado/index.md";
  slug: "programa-deep-dive-transformando-consultorias-em-potencias-do-mercado";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"proposta-para-empresas-de-consultoria-a-importancia-de-uma-boa-proposta-download-de-modelo/index.md": {
	id: "proposta-para-empresas-de-consultoria-a-importancia-de-uma-boa-proposta-download-de-modelo/index.md";
  slug: "proposta-para-empresas-de-consultoria-a-importancia-de-uma-boa-proposta-download-de-modelo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"provaworkbook/index.md": {
	id: "provaworkbook/index.md";
  slug: "provaworkbook";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"quais-as-vantagens-da-consultoria-online/index.md": {
	id: "quais-as-vantagens-da-consultoria-online/index.md";
  slug: "quais-as-vantagens-da-consultoria-online";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"qual-e-a-importancia-de-contratar-uma-boa-consultoria/index.md": {
	id: "qual-e-a-importancia-de-contratar-uma-boa-consultoria/index.md";
  slug: "qual-e-a-importancia-de-contratar-uma-boa-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"qualidade-e-controle-em-consultorias-transformando-desafios-em-excelencia/index.md": {
	id: "qualidade-e-controle-em-consultorias-transformando-desafios-em-excelencia/index.md";
  slug: "qualidade-e-controle-em-consultorias-transformando-desafios-em-excelencia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"receita-rapida-para-multiplicar-seus-clientes-e-aumentar-seu-faturamento-sem-aumentar-sua-equipe/index.md": {
	id: "receita-rapida-para-multiplicar-seus-clientes-e-aumentar-seu-faturamento-sem-aumentar-sua-equipe/index.md";
  slug: "receita-rapida-para-multiplicar-seus-clientes-e-aumentar-seu-faturamento-sem-aumentar-sua-equipe";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"retencao-de-clientes-por-que-devemos-trabalhar-com-isso/index.md": {
	id: "retencao-de-clientes-por-que-devemos-trabalhar-com-isso/index.md";
  slug: "retencao-de-clientes-por-que-devemos-trabalhar-com-isso";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"reviews/index.md": {
	id: "reviews/index.md";
  slug: "reviews";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"roadmap-2023-do-evolutto-foi-aqui-que-pediram-novas-funcionalidades/index.md": {
	id: "roadmap-2023-do-evolutto-foi-aqui-que-pediram-novas-funcionalidades/index.md";
  slug: "roadmap-2023-do-evolutto-foi-aqui-que-pediram-novas-funcionalidades";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"sincronizacao-automatica-de-eventos-entre-evolutto-e-google-agenda/index.md": {
	id: "sincronizacao-automatica-de-eventos-entre-evolutto-e-google-agenda/index.md";
  slug: "sincronizacao-automatica-de-eventos-entre-evolutto-e-google-agenda";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"software-2/index.md": {
	id: "software-2/index.md";
  slug: "software-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"software-consultoria-online/index.md": {
	id: "software-consultoria-online/index.md";
  slug: "software-consultoria-online";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"sua-consultoria-esta-pronta-para-escalar-mesmo-em-crise/index.md": {
	id: "sua-consultoria-esta-pronta-para-escalar-mesmo-em-crise/index.md";
  slug: "sua-consultoria-esta-pronta-para-escalar-mesmo-em-crise";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"sucesso-download-erp/index.md": {
	id: "sucesso-download-erp/index.md";
  slug: "sucesso-download-erp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"sucesso-download/index.md": {
	id: "sucesso-download/index.md";
  slug: "sucesso-download";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"suporte/index.md": {
	id: "suporte/index.md";
  slug: "suporte";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"tendencias-de-consultoria-para-2026-como-ganhar-relevancia-e-resultados-sem-sacrificar-tempo-ou-recursos/index.md": {
	id: "tendencias-de-consultoria-para-2026-como-ganhar-relevancia-e-resultados-sem-sacrificar-tempo-ou-recursos/index.md";
  slug: "tendencias-de-consultoria-para-2026-como-ganhar-relevancia-e-resultados-sem-sacrificar-tempo-ou-recursos";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"tenha-pospostas-irresistiveis-e-feche-mais-contratos-sem-precisar-reduzir-seus-precos/index.md": {
	id: "tenha-pospostas-irresistiveis-e-feche-mais-contratos-sem-precisar-reduzir-seus-precos/index.md";
  slug: "tenha-pospostas-irresistiveis-e-feche-mais-contratos-sem-precisar-reduzir-seus-precos";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"teste-2/index.md": {
	id: "teste-2/index.md";
  slug: "teste-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"toolkit-da-consultoria-digital/index.md": {
	id: "toolkit-da-consultoria-digital/index.md";
  slug: "toolkit-da-consultoria-digital";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transformacao-digital-consultoria-estrategias-sucesso/index.md": {
	id: "transformacao-digital-consultoria-estrategias-sucesso/index.md";
  slug: "transformacao-digital-consultoria-estrategias-sucesso";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transformamos-metodologia-de-consultoria/index.md": {
	id: "transformamos-metodologia-de-consultoria/index.md";
  slug: "transformamos-metodologia-de-consultoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transformamos-metodologias-de-consultoria-1/index.md": {
	id: "transformamos-metodologias-de-consultoria-1/index.md";
  slug: "transformamos-metodologias-de-consultoria-1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transformando-5-desafios-em-oportunidades-um-guia-para-consultores-empresariais/index.md": {
	id: "transformando-5-desafios-em-oportunidades-um-guia-para-consultores-empresariais/index.md";
  slug: "transformando-5-desafios-em-oportunidades-um-guia-para-consultores-empresariais";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transformando-consultorias-como-o-evolutto-multiplica-seus-resultados/index.md": {
	id: "transformando-consultorias-como-o-evolutto-multiplica-seus-resultados/index.md";
  slug: "transformando-consultorias-como-o-evolutto-multiplica-seus-resultados";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transformando-consultorias-por-que-deixar-de-vender-tempo-e-o-caminho-para-o-sucesso/index.md": {
	id: "transformando-consultorias-por-que-deixar-de-vender-tempo-e-o-caminho-para-o-sucesso/index.md";
  slug: "transformando-consultorias-por-que-deixar-de-vender-tempo-e-o-caminho-para-o-sucesso";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transformar-consultoria-em-produto-escalavel/index.md": {
	id: "transformar-consultoria-em-produto-escalavel/index.md";
  slug: "transformar-consultoria-em-produto-escalavel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transforme-reunioes-em-resultados-estrategicos-sem-perder-tempo-com-tarefas-repetitivas/index.md": {
	id: "transforme-reunioes-em-resultados-estrategicos-sem-perder-tempo-com-tarefas-repetitivas/index.md";
  slug: "transforme-reunioes-em-resultados-estrategicos-sem-perder-tempo-com-tarefas-repetitivas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transforme-seu-proximo-ano-e-multiplique-resultados-sem-passar-raiva-com-a-estagnacao/index.md": {
	id: "transforme-seu-proximo-ano-e-multiplique-resultados-sem-passar-raiva-com-a-estagnacao/index.md";
  slug: "transforme-seu-proximo-ano-e-multiplique-resultados-sem-passar-raiva-com-a-estagnacao";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transforme-sua-consultoria-num-sucesso-trabalhando-menos-e-sem-abrir-mao-da-qualidade/index.md": {
	id: "transforme-sua-consultoria-num-sucesso-trabalhando-menos-e-sem-abrir-mao-da-qualidade/index.md";
  slug: "transforme-sua-consultoria-num-sucesso-trabalhando-menos-e-sem-abrir-mao-da-qualidade";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"troque-5-ferramentas-pelo-evolutto-mais-eficiencia-para-consultorias-em-uma-unica-plataforma/index.md": {
	id: "troque-5-ferramentas-pelo-evolutto-mais-eficiencia-para-consultorias-em-uma-unica-plataforma/index.md";
  slug: "troque-5-ferramentas-pelo-evolutto-mais-eficiencia-para-consultorias-em-uma-unica-plataforma";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"videos-com-ia/index.md": {
	id: "videos-com-ia/index.md";
  slug: "videos-com-ia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"whatsapp-integrado-a-chave-para-um-atendimento-impecavel/index.md": {
	id: "whatsapp-integrado-a-chave-para-um-atendimento-impecavel/index.md";
  slug: "whatsapp-integrado-a-chave-para-um-atendimento-impecavel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};
"pages": {
"jornada-da-sustentabilidade-internacional-a12-funcionario/index.md": {
	id: "jornada-da-sustentabilidade-internacional-a12-funcionario/index.md";
  slug: "jornada-da-sustentabilidade-internacional-a12-funcionario";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
"jornada-da-sustentabilidade-internacional-a12/index.md": {
	id: "jornada-da-sustentabilidade-internacional-a12/index.md";
  slug: "jornada-da-sustentabilidade-internacional-a12";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
"jornada-proex-banco-do-brasil-funcionario/index.md": {
	id: "jornada-proex-banco-do-brasil-funcionario/index.md";
  slug: "jornada-proex-banco-do-brasil-funcionario";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
"jornada-proex-banco-do-brasil/index.md": {
	id: "jornada-proex-banco-do-brasil/index.md";
  slug: "jornada-proex-banco-do-brasil";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
"programa-1a-exportacao-banco-do-brasil-funcionario/index.md": {
	id: "programa-1a-exportacao-banco-do-brasil-funcionario/index.md";
  slug: "programa-1a-exportacao-banco-do-brasil-funcionario";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
"programa-1a-exportacao-banco-do-brasil-mulheres-funcionario/index.md": {
	id: "programa-1a-exportacao-banco-do-brasil-mulheres-funcionario/index.md";
  slug: "programa-1a-exportacao-banco-do-brasil-mulheres-funcionario";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
"programa-1a-exportacao-banco-do-brasil-mulheres/index.md": {
	id: "programa-1a-exportacao-banco-do-brasil-mulheres/index.md";
  slug: "programa-1a-exportacao-banco-do-brasil-mulheres";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
"programa-1a-exportacao-banco-do-brasil/index.md": {
	id: "programa-1a-exportacao-banco-do-brasil/index.md";
  slug: "programa-1a-exportacao-banco-do-brasil";
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"custom": Record<string, {
  id: string;
  collection: "custom";
  data: any;
}>;

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
