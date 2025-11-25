import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
} from 'react-native';

export default function Historia() {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Imagem de capa */}
            <Image
                source={require('../../assets/images/SantaCruz.jpg')}
                style={styles.coverImage}
                resizeMode="cover"
            />

            {/* Título */}
            <Text style={styles.title}>História de Santa Cruz dos Milagres</Text>

            {/* Conteúdo da história */}
            <View style={styles.content}>
                <Text style={styles.paragraph}>
                    Santa Cruz dos Milagres é um município brasileiro localizado no estado do Piauí,
                    com uma rica história que remonta aos primeiros colonizadores da região. A cidade
                    foi fundada em meados do século XVIII, quando missionários e exploradores
                    estabeleceram os primeiros povoados na área, atraídos pela fertilidade das terras
                    e pela presença de recursos naturais abundantes.
                </Text>

                <Text style={styles.paragraph}>
                    O nome "Santa Cruz dos Milagres" tem origem em uma lenda local que conta sobre
                    uma cruz milagrosa encontrada pelos primeiros habitantes. Segundo a tradição
                    oral, essa cruz teria aparecido misteriosamente em um local específico, e
                    diversos milagres foram atribuídos a ela, atraindo peregrinos e devotos de
                    toda a região. Esse evento marcou profundamente a identidade cultural e
                    religiosa da comunidade.
                </Text>

                <Text style={styles.paragraph}>
                    Ao longo dos séculos, a cidade desenvolveu-se como um importante centro
                    comercial e agrícola do interior piauiense. A economia local sempre esteve
                    baseada na agricultura familiar, na pecuária extensiva e no comércio de
                    produtos regionais. A comunidade manteve suas tradições culturais,
                    preservando festas religiosas, danças folclóricas e manifestações artísticas
                    que são passadas de geração em geração.
                </Text>

                <Text style={styles.paragraph}>
                    Hoje, Santa Cruz dos Milagres continua sendo um lugar de grande importância
                    histórica e cultural para o Piauí. A cidade preserva suas raízes enquanto
                    busca o desenvolvimento sustentável, mantendo o equilíbrio entre o progresso
                    e a preservação de suas tradições. Os moradores orgulham-se de sua história
                    e trabalham para manter viva a memória dos fundadores e das gerações que
                    construíram essa comunidade ao longo dos anos.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    contentContainer: {
        paddingBottom: 30,
    },
    coverImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#e5e7eb',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0027a6ff',
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    content: {
        paddingHorizontal: 20,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#374151',
        marginBottom: 20,
        textAlign: 'justify',
    },
});
