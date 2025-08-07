import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  PanGestureHandler,
  State,
} from 'react-native';
import Slider from '@react-native-community/slider';

import { User } from '../types/auth';
import { colors, spacing, typography, borderRadius } from '../styles/theme';
import { globalStyles, screenWidth, screenHeight } from '../styles/globalStyles';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  isBold: boolean;
  isUnderlined: boolean;
  isItalic: boolean;
}

interface AdvancedStoryCreatorProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
  currentUser: User | null;
}

const AdvancedStoryCreator: React.FC<AdvancedStoryCreatorProps> = ({
  visible,
  onClose,
  onSubmit,
  currentUser,
}) => {
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState('gradient1');
  const [customBgColor, setCustomBgColor] = useState('#FF6B6B');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'background'>('text');

  // Story dimensions
  const storyWidth = screenWidth * 0.7;
  const storyHeight = storyWidth * 1.5; // 16:9 aspect ratio

  // Predefined backgrounds
  const backgrounds = {
    gradient1: { type: 'gradient', colors: ['#8B5CF6', '#EC4899', '#EF4444'] },
    gradient2: { type: 'gradient', colors: ['#3B82F6', '#8B5CF6', '#EC4899'] },
    gradient3: { type: 'gradient', colors: ['#10B981', '#3B82F6', '#8B5CF6'] },
    gradient4: { type: 'gradient', colors: ['#F59E0B', '#EF4444', '#EC4899'] },
    gradient5: { type: 'gradient', colors: ['#6366F1', '#8B5CF6', '#EC4899'] },
    solid1: { type: 'solid', color: '#000000' },
    solid2: { type: 'solid', color: '#FFFFFF' },
    solid3: { type: 'solid', color: '#EF4444' },
    solid4: { type: 'solid', color: '#3B82F6' },
    solid5: { type: 'solid', color: '#10B981' },
  };

  const fonts = ['Inter', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman'];
  const textColors = ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
  const bgColors = ['transparent', '#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1'];

  // Add new text element
  const addTextElement = () => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      text: 'Digite aqui',
      x: storyWidth / 2 - 50,
      y: storyHeight / 2 - 15,
      fontSize: 24,
      fontFamily: 'Inter',
      color: '#FFFFFF',
      backgroundColor: 'transparent',
      isBold: false,
      isUnderlined: false,
      isItalic: false,
    };
    
    setTextElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  // Update selected element
  const updateSelectedElement = (updates: Partial<TextElement>) => {
    if (!selectedElementId) return;
    
    setTextElements(prev => 
      prev.map(el => 
        el.id === selectedElementId ? { ...el, ...updates } : el
      )
    );
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    
    setTextElements(prev => prev.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  // Get selected element
  const selectedElement = textElements.find(el => el.id === selectedElementId);

  // Handle text element drag
  const handleTextPan = (elementId: string, gestureEvent: any) => {
    const { translationX, translationY, state } = gestureEvent.nativeEvent;
    
    if (state === State.ACTIVE) {
      setTextElements(prev => 
        prev.map(el => {
          if (el.id === elementId) {
            const newX = Math.max(0, Math.min(el.x + translationX, storyWidth - 100));
            const newY = Math.max(50, Math.min(el.y + translationY, storyHeight - 50));
            return { ...el, x: newX, y: newY };
          }
          return el;
        })
      );
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (textElements.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um texto ao seu story');
      return;
    }

    setLoading(true);
    try {
      // Create a simple text representation for now
      const content = textElements.map(el => el.text).join(' ');
      await onSubmit(content);
      onClose();
      setTextElements([]);
      setSelectedElementId(null);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar story');
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundStyle = () => {
    if (selectedBackground === 'custom') {
      return { backgroundColor: customBgColor };
    }
    
    const bg = backgrounds[selectedBackground as keyof typeof backgrounds];
    if (bg.type === 'solid') {
      return { backgroundColor: bg.color };
    }
    
    // For gradients, we'll use a simple color for now
    // In production, you'd use react-native-linear-gradient
    return { backgroundColor: bg.colors?.[0] || '#3B82F6' };
  };

  const renderTextControls = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity onPress={addTextElement} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Adicionar Texto</Text>
      </TouchableOpacity>

      {selectedElement && (
        <View style={styles.controls}>
          <Text style={styles.controlLabel}>Texto</Text>
          <TextInput
            value={selectedElement.text}
            onChangeText={(text) => updateSelectedElement({ text })}
            style={styles.textInput}
            multiline
            placeholder="Digite seu texto aqui..."
            placeholderTextColor={colors.textLight}
          />

          <Text style={styles.controlLabel}>Fonte</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fontScroll}>
            {fonts.map(font => (
              <TouchableOpacity
                key={font}
                onPress={() => updateSelectedElement({ fontFamily: font })}
                style={[
                  styles.fontButton,
                  selectedElement.fontFamily === font && styles.fontButtonSelected
                ]}
              >
                <Text style={styles.fontButtonText}>{font}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={deleteSelectedElement} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>🗑️ Deletar Texto</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderStyleControls = () => {
    if (!selectedElement) {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.noSelectionText}>Selecione um texto para editar</Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <Text style={styles.controlLabel}>Tamanho da Fonte ({selectedElement.fontSize}px)</Text>
        <Slider
          style={styles.slider}
          minimumValue={12}
          maximumValue={72}
          value={selectedElement.fontSize}
          onValueChange={(value) => updateSelectedElement({ fontSize: Math.round(value) })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbStyle={{ backgroundColor: colors.primary }}
        />

        <Text style={styles.controlLabel}>Cor do Texto</Text>
        <View style={styles.colorGrid}>
          {textColors.map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => updateSelectedElement({ color })}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedElement.color === color && styles.colorButtonSelected
              ]}
            />
          ))}
        </View>

        <Text style={styles.controlLabel}>Fundo do Texto</Text>
        <View style={styles.colorGrid}>
          {bgColors.map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => updateSelectedElement({ backgroundColor: color })}
              style={[
                styles.colorButton,
                { 
                  backgroundColor: color === 'transparent' ? 'transparent' : color,
                  borderWidth: color === 'transparent' ? 2 : 0,
                  borderColor: colors.border,
                  borderStyle: color === 'transparent' ? 'dashed' : 'solid'
                },
                selectedElement.backgroundColor === color && styles.colorButtonSelected
              ]}
            >
              {color === 'transparent' && (
                <Text style={styles.transparentText}>∅</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.controlLabel}>Estilo</Text>
        <View style={styles.styleButtons}>
          <TouchableOpacity
            onPress={() => updateSelectedElement({ isBold: !selectedElement.isBold })}
            style={[styles.styleButton, selectedElement.isBold && styles.styleButtonActive]}
          >
            <Text style={[styles.styleButtonText, { fontWeight: 'bold' }]}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateSelectedElement({ isItalic: !selectedElement.isItalic })}
            style={[styles.styleButton, selectedElement.isItalic && styles.styleButtonActive]}
          >
            <Text style={[styles.styleButtonText, { fontStyle: 'italic' }]}>I</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateSelectedElement({ isUnderlined: !selectedElement.isUnderlined })}
            style={[styles.styleButton, selectedElement.isUnderlined && styles.styleButtonActive]}
          >
            <Text style={[styles.styleButtonText, { textDecorationLine: 'underline' }]}>U</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBackgroundControls = () => (
    <View style={styles.tabContent}>
      <Text style={styles.controlLabel}>Fundos Predefinidos</Text>
      <View style={styles.backgroundGrid}>
        {Object.entries(backgrounds).map(([key, bg]) => (
          <TouchableOpacity
            key={key}
            onPress={() => setSelectedBackground(key)}
            style={[
              styles.backgroundButton,
              { backgroundColor: bg.type === 'solid' ? bg.color : bg.colors?.[0] || '#3B82F6' },
              selectedBackground === key && styles.backgroundButtonSelected
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Story Preview */}
        <View style={styles.previewContainer}>
          <View style={[styles.storyCanvas, getBackgroundStyle()]}>
            {/* User info */}
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {currentUser?.first_name?.charAt(0)}{currentUser?.last_name?.charAt(0)}
                </Text>
              </View>
              <Text style={styles.userName}>
                {currentUser?.first_name} {currentUser?.last_name}
              </Text>
              <Text style={styles.timeLabel}>agora</Text>
            </View>

            {/* Text Elements */}
            {textElements.map((element) => (
              <PanGestureHandler
                key={element.id}
                onGestureEvent={(e) => handleTextPan(element.id, e)}
              >
                <View
                  style={[
                    styles.textElement,
                    {
                      left: element.x,
                      top: element.y,
                    },
                    selectedElementId === element.id && styles.selectedTextElement
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedElementId(element.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={{
                        fontSize: element.fontSize,
                        fontFamily: element.fontFamily,
                        color: element.color,
                        backgroundColor: element.backgroundColor === 'transparent' ? 'transparent' : element.backgroundColor,
                        fontWeight: element.isBold ? 'bold' : 'normal',
                        textDecorationLine: element.isUnderlined ? 'underline' : 'none',
                        fontStyle: element.isItalic ? 'italic' : 'normal',
                        textShadowColor: 'rgba(0,0,0,0.5)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 3,
                        padding: element.backgroundColor !== 'transparent' ? 4 : 0,
                        borderRadius: element.backgroundColor !== 'transparent' ? 4 : 0,
                      }}
                    >
                      {element.text}
                    </Text>
                  </TouchableOpacity>
                </View>
              </PanGestureHandler>
            ))}

            {/* Empty state */}
            {textElements.length === 0 && (
              <View style={styles.emptyCanvas}>
                <Text style={styles.emptyText}>Toque + para adicionar texto</Text>
              </View>
            )}
          </View>
        </View>

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          {/* Header */}
          <View style={styles.controlHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.controlTitle}>Editor de Story</Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={textElements.length === 0 || loading}
              style={[styles.publishButton, (textElements.length === 0 || loading) && styles.publishButtonDisabled]}
            >
              <Text style={styles.publishButtonText}>
                {loading ? 'Publicando...' : '📱 Publicar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {[
              { id: 'text', label: 'Texto', icon: '📝' },
              { id: 'style', label: 'Estilo', icon: '🎨' },
              { id: 'background', label: 'Fundo', icon: '🌈' }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <ScrollView style={styles.tabContentContainer}>
            {activeTab === 'text' && renderTextControls()}
            {activeTab === 'style' && renderStyleControls()}
            {activeTab === 'background' && renderBackgroundControls()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.backgroundDark,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
  storyCanvas: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5 * 1.5,
    borderRadius: borderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  userInfo: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  userAvatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  userName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginRight: spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timeLabel: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.8,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  textElement: {
    position: 'absolute',
  },
  selectedTextElement: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  emptyCanvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.white,
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  controlPanel: {
    width: screenWidth * 0.5,
    backgroundColor: colors.surface,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.textGray,
  },
  controlTitle: {
    ...typography.h3,
    fontSize: 16,
  },
  publishButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  publishButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  publishButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  tabText: {
    ...typography.caption,
    color: colors.textGray,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    padding: spacing.md,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  controls: {
    marginTop: spacing.md,
  },
  controlLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    minHeight: 60,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  fontScroll: {
    marginBottom: spacing.md,
  },
  fontButton: {
    backgroundColor: colors.backgroundGray,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  fontButtonSelected: {
    backgroundColor: colors.primary,
  },
  fontButtonText: {
    fontSize: 12,
    color: colors.text,
  },
  deleteButton: {
    backgroundColor: colors.error,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 12,
  },
  noSelectionText: {
    ...typography.body,
    color: colors.textGray,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: spacing.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  transparentText: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
    lineHeight: 28,
  },
  styleButtons: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  styleButton: {
    backgroundColor: colors.backgroundGray,
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  styleButtonActive: {
    backgroundColor: colors.primary,
  },
  styleButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  backgroundButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    margin: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  backgroundButtonSelected: {
    borderColor: colors.white,
    borderWidth: 3,
  },
});

export default AdvancedStoryCreator;
