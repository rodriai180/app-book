Quiero que analices esta aplicación completa con foco en clean code y mantenibilidad.

Objetivo general:
Revisar la arquitectura, componentes, servicios, modelos, helpers y archivos de configuración para detectar oportunidades de mejora, refactorización y estandarización del código.

Criterios que debes evaluar sí o sí:

1. Evitar repeticiones
- Detecta lógica duplicada, estructuras repetidas, funciones similares, bloques HTML/TS/SCSS repetidos y patrones que puedan abstraerse.
- Propón refactors para reutilizar código mediante funciones utilitarias, servicios, clases base, interfaces, tipos, pipes, helpers o componentes reutilizables.

2. Mantener estructuras similares
- Verifica si componentes o módulos que resuelven problemas parecidos están construidos con patrones distintos innecesariamente.
- Sugiere una estructura homogénea para archivos, naming, organización interna, inputs, outputs, métodos, interfaces y manejo de estados.
- Marca inconsistencias entre componentes similares y propone una versión estándar.

3. Centralización de constantes y variables reutilizables
- Detecta valores hardcodeados repetidos en el proyecto.
- Señala qué valores deberían centralizarse en archivos de constantes, config, enums o helpers.
- Indica cuáles deberían vivir a nivel:
  - global
  - módulo
  - componente
  - función
- Prioriza evitar “magic numbers”, strings repetidos, claves de objetos repetidas, nombres de rutas, labels, mensajes y configuraciones dispersas.

4. Centralización de strings
- Revisa todos los strings visibles o reutilizados en el sistema.
- Detecta textos hardcodeados y sugiere moverlos a un único archivo o estructura centralizada.
- Propón una organización clara, por ejemplo:
  - strings por feature
  - strings globales
  - labels
  - mensajes de error
  - placeholders
  - textos de botones
  - títulos y subtítulos
- Indica cómo deberían referenciarse desde los componentes para no dejar texto escrito directamente en el código.

5. Nombres claros y consistentes
- Evalúa nombres de variables, funciones, componentes, interfaces, enums y archivos.
- Detecta nombres ambiguos, demasiado genéricos o inconsistentes.
- Sugiere nombres más claros, cortos y coherentes con el resto de la aplicación.

6. Separación de responsabilidades
- Detecta componentes demasiado grandes o con demasiada lógica.
- Marca si hay lógica de negocio dentro del componente que debería ir en servicios, helpers o utilidades.
- Revisa si el HTML, TypeScript y SCSS están organizados de forma limpia y mantenible.

7. Escalabilidad y mantenibilidad
- Evalúa si la forma actual de construir la app facilita agregar nuevas features sin romper consistencia.
- Propón una convención general para que futuras pantallas o componentes sigan la misma línea de clean code.

Forma de responder:
- No me des una respuesta genérica.
- Analiza el código real y dame observaciones concretas.
- Divide la respuesta por:
  1. Problemas encontrados
  2. Por qué es un problema
  3. Refactor propuesto
  4. Ejemplo de cómo quedaría
  5. Prioridad (alta, media, baja)

Además:
- Si encuentras patrones repetidos, agrúpalos.
- Si detectas archivos que deberían unificarse o abstraerse, dilo explícitamente.
- Si ves strings o constantes dispersas, propone exactamente cómo centralizarlas.
- Si ves componentes similares hechos de formas distintas, define cuál debería ser la convención final.
- Prioriza soluciones limpias, reutilizables y fáciles de mantener.
- No rompas funcionalidad existente: cualquier propuesta debe respetar el comportamiento actual.