<div align="center">

# CaptainCoder

![CaptainCoder Logo](icon.png)
</div>

## 🚧 Work In Progress 🚧

**Note: This project is currently a work in progress and is not yet finalized.**

## Description

CaptainCoder is a privacy-focused, locally-run code completion extension for VSCode that supports a wide range of popular large language models. With open-source flexibility and the integration of Retrieval-Augmented Generation (RAG), it provides enhanced context-aware suggestions and custom embedding models, ensuring advanced, tailored autocompletion while maintaining full control over your code and data privacy.

## Features

- **AI-Powered Code Completion:** Utilizes customizable models (Ollama, OpenAI, Mistral, Hugging Face, Anthropic, etc.) for intelligent code suggestions.
- **Privacy and Control:** Operates locally to ensure complete privacy and control over your code, made possible by local support of Ollama and Retrieval-Augmented Generation (RAG) context.
- **Open-Source and Extensible:** Fully open-source, allowing for community contributions and extensions.
- **Extensible Model Provider:** Offers support for a variety of popular large language models, both paid and open-source, allowing you to choose based on your privacy and budget preferences.
- **Context-Aware Suggestions:** Provides enhanced autocompletion with a deeper understanding of the entire codebase by supplying the model with complete code context via RAG.
- **Custom Embedding Models:** Allows users to create and use custom embedding models for specialized use cases by feeding various types of documents (e.g., PDF, web pages, Microsoft documents, Confluence pages, text files, JSON, CSV, etc.) to the models through RAG.
- **Flexible Model Switching:** Enables easy switching between different models while retaining customized enhancements and specialized functionalities, ensuring adaptability to various needs.

## Installation

1. **Install Ollama Locally:**
   - Visit [https://ollama.com/](https://ollama.com/) for detailed installation instructions.

2. **Install CaptainCoder VSCode Extension:**
   - Open VSCode.
   - Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
   - Search for `CaptainCoder`.
   - Click `Install` to add the extension to your VSCode setup.

## Usage (Currently Only Basic)

1. **List Available Models:**
   - Use the command `CaptainCoder: List Models` to fetch the list.
2. **Install New Models:**
    - Use the command `CaptainCoder: Pull Model` to install a model.
3. **Generate Text:**
    - Use the command `CaptainCoder: Generate Text` to chat with the model.

## Issues

If you encounter any issues, please report them on the GitHub issues page.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
